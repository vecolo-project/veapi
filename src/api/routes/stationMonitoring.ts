import { NextFunction, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { Station } from '../entities/Station';
import isStation from '../middlewares/isStation';
import attachStation from '../middlewares/attachStation';
import { StationRequest } from '../../types/stationRequest';
import StationMonitoringService from '../services/StationMonitoringService';
import {
  StationMonitoring,
  StationMonitoringCreationProps,
  StationMonitoringStatus,
} from '../entities/StationMonitoring';
import { celebrate, Joi } from 'celebrate';

const route = Router();

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
export default route;
