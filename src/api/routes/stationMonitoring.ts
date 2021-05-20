import { NextFunction, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { Station } from '../entities/Station';
import isStation from '../middlewares/isStation';
import attachStation from '../middlewares/attachStation';
import { StationRequest } from '../../types/stationRequest';
import StationMonitoringService from '../services/StationMonitoringService';
import { StationMonitoring } from '../entities/StationMonitoring';
import { celebrate, Joi } from 'celebrate';

const route = Router();

route.post(
  '/add-metric',
  isStation,
  attachStation,
  celebrate({
    body: Joi.object({
      status: Joi.string().required(),
      batteryPercent: Joi.number().required(),
      chargingPower: Joi.number().required(),
      isActive: Joi.boolean().required(),
      usedBikeSlot: Joi.number().integer().required(),
    }),
  }),
  async (req: StationRequest, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling GET /station-monitoring/add-metric endpoint');
    try {
      const station: Station = req.currentStation;
      const stationMonitoringService = Container.get(StationMonitoringService);
      const stationMonitoring: StationMonitoring = await stationMonitoringService.create(
        StationMonitoring.create({
          station,
          status: req.body.status,
          batteryPercent: req.body.batteryPercent,
          chargingPower: req.body.chargingPower,
          isActive: req.body.isActive,
          usedBikeSlot: req.body.usedBikeSlot,
          createdAt: new Date(),
        })
      );
      return res.json(stationMonitoring).status(200);
    } catch (e) {
      return next(e);
    }
  }
);
export default route;
