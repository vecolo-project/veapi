import {NextFunction, Request, Response, Router} from 'express';
import {Logger} from 'winston';
import {Container} from 'typedi';
import {checkRole, isAuth} from '../middlewares';
import {Role} from '../entities/User';
import StationService from '../services/StationService';
import {Station} from '../entities/Station';
import {celebrate, Joi} from 'celebrate';
import RideService from '../services/RideService';
import BikeService from '../services/BikeService';

const route = Router();

const paramsRules = celebrate({
    body: Joi.object({
        id: Joi.number().optional(),
        batteryCapacity: Joi.number().min(0).required(),
        bikeCapacity: Joi.number().min(0).required(),
        streetNumber: Joi.number().min(0).required(),
        streetName: Joi.string().min(1).required(),
        city: Joi.string().min(1).required(),
        zipcode: Joi.string().min(5).max(5).required(),
        coordinateX: Joi.number().required(),
        coordinateY: Joi.number().required(),
    }),
});
const defaultService = StationService;

route.get(
    '/generate-token/:stationId',
    isAuth,
    checkRole(Role.ADMIN),
    async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling GET /station/generate-token endpoint');
        try {
            const stationId = Number.parseInt(req.params.stationId);
            const stationServiceInstance = Container.get(StationService);
            const station: Station = await stationServiceInstance.findOne(stationId);
            return res
                .json(stationServiceInstance.generateToken(station))
                .status(200);
        } catch (e) {
            return next(e);
        }
    }
);

route.post(
    '/',
    isAuth,
    checkRole(Role.ADMIN),
    paramsRules,
    async (req, res, next) => {
        const service = Container.get(defaultService);
        try {
            const entityResult = await service.create(req.body);
            return res.status(201).json(entityResult);
        } catch (e) {
            return next(e);
        }
    }
);

route.get('/', async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling GET /station endpoint');

    try {
        const service = Container.get(defaultService);
        const offset = Number(req.query.offset) || 0;
        const limit = Number(req.query.limit) || 20;
        const stations = await service.findAll({offset, limit});
        const count = await service.getRepo().count();
        return res.status(200).json({stations, count});
    } catch (e) {
        return next(e);
    }
});

route.get('/' + ':id', async (req, res, next) => {
    try {
        const service = Container.get(defaultService);
        const id = Number.parseInt(req.params.id);
        const entityResult = await service.getOne(id);
        return res.status(200).json(entityResult);
    } catch (e) {
        return next(e);
    }
});

route.delete(
    '/' + ':id',
    isAuth,
    checkRole(Role.ADMIN),
    async (req, res, next) => {
        try {
            const service = Container.get(defaultService);
            const bikeService = Container.get(BikeService);
            const id = Number.parseInt(req.params.id);
            const bikes = await bikeService.getAllFromStation(id, {
                limit: 1,
                offset: 0,
            });
            if (bikes.length > 0) {
                res
                    .status(403)
                    .json({message: 'Impossible de supprimer cette station'});
                return;
            }
            const rideService = Container.get(RideService);
            const rides = await rideService.getAllRideFromStation(id, {
                limit: 1,
                offset: 0,
            });
            if (rides.length > 0) {
                res
                    .status(403)
                    .json({message: 'Impossible de supprimer cette station'});
                return;
            }

            await service.delete(id);
            return res.status(204);
        } catch (e) {
            return next(e);
        }
    }
);

route.put(
    '/' + ':id',
    isAuth,
    checkRole(Role.ADMIN),
    paramsRules,
    async (req, res, next) => {
        const service = Container.get(defaultService);
        const id = Number.parseInt(req.params.id);
        try {
            const entityResult = await service.update(id, req.body);
            return res.status(201).json(entityResult);
        } catch (e) {
            return next(e);
        }
    }
);

export default route;
