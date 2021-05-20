import { Container } from 'typedi';
import { Logger } from 'winston';
import { NextFunction, Response } from 'express';
import StationService from '../services/StationService';
import { StationRequest } from '../../types/stationRequest';
import { Station } from '../entities/Station';

const attachStation = async (
  req: StationRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  const logger: Logger = Container.get('logger');
  try {
    const stationService = Container.get(StationService);
    const stationEntity: Station = await stationService.findOne(req.token.id);
    if (!stationEntity) {
      return res.sendStatus(401);
    }
    req.currentStation = stationEntity;
    return next();
  } catch (e) {
    logger.error('Error attaching station to req: %o', e);
    return next(e);
  }
};

export default attachStation;
