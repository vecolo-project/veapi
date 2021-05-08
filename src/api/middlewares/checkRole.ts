import { Container } from 'typedi';
import { Logger } from 'winston';
import { Response, NextFunction, RequestHandler } from 'express';
import { User, Role } from '../entities/User';
import UserService from '../services/UserService';
import { userRequest } from '../../types/userRequest';

const checkRole = (role: Role): RequestHandler => async (
  req: userRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  const logger: Logger = Container.get('logger');
  try {
    const userService = Container.get(UserService);
    const userEntity: User = await userService.findOne(req.token.id);
    if (!userEntity) {
      return res.sendStatus(401);
    }
    if (!userEntity.hasAccessTo(role)) {
      return res.sendStatus(403);
    }
    return next();
  } catch (e) {
    logger.error('Error checking user role: %o', e);
    return next(e);
  }
};

export default checkRole;
