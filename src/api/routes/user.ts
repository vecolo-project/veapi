import { NextFunction, Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { isAuth, attachUser, checkRole } from '../middlewares';
import UserService from '../services/UserService';
import { userRequest } from '../../types/userRequest';
import { Role } from '../entities/User';

const route = Router();

/**
 * @openapi
 * /user:
 *   get:
 *     description: GET all users
 *     responses:
 *       200:
 *         description: Returns all the users.
 */
route.get(
  '/',
  isAuth,
  checkRole(Role.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling GET /user endpoint');
    try {
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.find();
      return res.json(users).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * @openapi
 * /user/current:
 *   get:
 *     description: GET the current user
 *     responses:
 *       200:
 *         description: Retrun the user who made the request
 */
route.get('/current', isAuth, attachUser, (req: userRequest, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling GET /user/current endpoint');
  return res.json({ user: req.currentUser }).status(200);
});

export default route;
