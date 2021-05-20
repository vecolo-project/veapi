import { NextFunction, Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import StationService from '../services/StationService';
import { Station } from '../entities/Station';

const route = Router();

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
export default route;