import { NextFunction, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { Station } from '../entities/Station';
import isStation from '../middlewares/isStation';
import attachStation from '../middlewares/attachStation';
import { StationRequest } from '../../types/stationRequest';
import StationMonitoringService from '../services/StationMonitoringService';
import {
  StationMonitoringCreationProps,
  StationMonitoringStatus,
} from '../entities/StationMonitoring';
import { celebrate, Joi } from 'celebrate';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    isActive: Joi.boolean().required(),
    status: Joi.string().allow('ACTIVE', 'MAINTAINING', 'OFF').required(),
    batteryPercent: Joi.number().min(0).max(100).required(),
    chargingPower: Joi.number().min(0).required(),
    usedBikeSlot: Joi.number().min(0).required(),
    station: Joi.number().min(0).required(),
  }),
});
const defaultService = StationMonitoringService;

route.post(
  '/add-metric',
  isStation,
  attachStation,
  celebrate({
    body: Joi.object({
      battery: Joi.number().required(),
      charging_power: Joi.number().required(),
      active: Joi.boolean().required(),
      used_seats: Joi.number().integer().required(),
    }),
  }),
  async (req: StationRequest, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling POST /station-monitoring/add-metric endpoint');
    try {
      const station: Station = req.currentStation;
      const stationMonitoringProps: StationMonitoringCreationProps = {
        station,
        batteryPercent: req.body.battery,
        status: req.body.active
          ? StationMonitoringStatus.ACTIVE
          : StationMonitoringStatus.OFF,
        chargingPower: req.body.charging_power,
        isActive: req.body.active,
        usedBikeSlot: req.body.used_seats,
      };
      const stationMonitoringService = Container.get(StationMonitoringService);
      const stationMonitoring = await stationMonitoringService.addMetric(
        station.id,
        stationMonitoringProps
      );
      return res.json(stationMonitoring).status(201);
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

route.get('/', isAuth, checkRole(Role.STAFF), async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 20;
    const result = await service.find({ offset, limit });
    return res.status(200).json(result);
  } catch (e) {
    return next(e);
  }
});

route.get(
  '/' + ':id',
  isAuth,
  checkRole(Role.STAFF),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const id = Number.parseInt(req.params.id);
      const entityResult = await service.findOne(id);
      return res.status(200).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.delete(
  '/' + ':id',
  isAuth,
  checkRole(Role.ADMIN),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const id = Number.parseInt(req.params.id);
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

route.get(
  '/:id/period/',
  celebrate({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({
      dateStart: Joi.date().required(),
      dateEnd: Joi.date().required(),
    }),
  }),
  async (req, res, next) => {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    const dateStart: Date = new Date(req.query.dateStart.toString());
    const dateEnd: Date = new Date(req.query.dateEnd.toString());
    const logger: Logger = Container.get('logger');
    logger.debug('Calling POST /station-monitoring/:id/period endpoint');
    try {
      const entityResult = await service.getMonitoringFromPeriod(
        id,
        dateStart,
        dateEnd
      );
      return res.status(200).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
