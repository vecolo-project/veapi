import { Container } from 'typedi';
import { Logger } from 'winston';
import { NextFunction, Response } from 'express';
import { User } from '../entities/User';
import UserService from '../services/UserService';
import { userRequest } from '../../types/userRequest';

const attachUser = async (
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
    req.currentUser = userEntity;
    return next();
  } catch (e) {
    logger.error('Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachUser;
