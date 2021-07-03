import { Router } from 'express';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import BikeService from '../services/BikeService';
import RideService from '../services/RideService';
import BikeMaintenanceThreadService from '../services/BikeMaintenanceThreadService';
import { Bike } from '../entities/Bike';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    matriculate: Joi.string().max(32).min(10).required(),
    station: Joi.number().min(0).required(),
    batteryPercent: Joi.number().min(0).max(100).required(),
    recharging: Joi.boolean().required(),
    model: Joi.number().min(0).required(),
    status: Joi.string()
      .allow('OFF', 'MAINTAINING', 'IN_RIDE', 'RECHARGING')
      .required(),
  }),
});
const defaultService = BikeService;

route.post(
  '/',
  isAuth,
  checkRole(Role.STAFF),
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
  try {
    const service = Container.get(defaultService);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const entityResult = await service.find({ offset, limit });
    return res.status(200).json(entityResult);
  } catch (e) {
    return next(e);
  }
});

route.get('/' + ':id', async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    const entityResult = await service.findOne(id);
    return res.status(200).json(entityResult);
  } catch (e) {
    return next(e);
  }
});
route.get('/station/' + ':id', async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const id = Number.parseInt(req.params.id);
    const bikes: Bike[] = await service.getAllFromStation(id, {
      limit,
      offset,
    });
    const count = await service.getRepo().count({ where: { station: { id } } });
    return res.status(200).json({ bikes, count });
  } catch (e) {
    return next(e);
  }
});

route.delete(
  '/' + ':id',
  isAuth,
  checkRole(Role.STAFF),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const serviceRide = Container.get(RideService);
      const serviceBikeMaintenance = Container.get(
        BikeMaintenanceThreadService
      );
      const id = Number.parseInt(req.params.id);
      const thread = await serviceBikeMaintenance.getAllFromBike(id);
      const rides = await serviceRide.getAllRideFromBike(id);
      if (thread.length != 0 || rides.length != 0)
        return res
          .status(403)
          .json({ message: 'Impossible de supprimer ce vélo' });
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
  checkRole(Role.STAFF),
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
