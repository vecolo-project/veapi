import { NextFunction, Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { isAuth, attachUser, checkRole } from '../middlewares';
import UserService from '../services/UserService';
import { userRequest } from '../../types/userRequest';
import { Role } from '../entities/User';
import { celebrate, Joi } from 'celebrate';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    birthDate: Joi.date().max('now').required(),
    isActive: Joi.boolean().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
    pseudo: Joi.string().min(7).required(),
    newsletter: Joi.boolean().required(),
    role: Joi.string()
      .allow('ADMIN', 'CLIENT', 'STAFF', 'STATION')
      .required(),
  }),
});
const defaultService = UserService;

route.get(
  '/',
  isAuth,
  checkRole(Role.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling GET /user endpoint');
    try {
      const userServiceInstance = Container.get(UserService);
      const offset = req.body.offset || 0;
      const limit = req.body.limit || 20;
      const users = await userServiceInstance.find({ offset, limit });
      return res.json(users).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/current', isAuth, attachUser, (req: userRequest, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling GET /user/current endpoint');
  return res.json({ user: req.currentUser }).status(200);
});

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

route.get(
  '/' + ':id',
  isAuth,
  checkRole(Role.ADMIN),
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
      //TODO delete dependency
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
      await service.update(id, req.body);
      const userUpdated = await service.findOne(id);
      return res.status(201).json(userUpdated);
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  '/register/',
  celebrate({
    body: Joi.object({
      firstName: Joi.string().min(1).required(),
      lastName: Joi.string().min(1).required(),
      birthDate: Joi.date().max('now').required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(7).required(),
      pseudo: Joi.string().min(7).required(),
      newsletter: Joi.boolean().required(),
    }),
  }),
  async (req, res, next) => {
    req.body.isActive = true;
    req.body.role = Role.CLIENT;
    const service = Container.get(defaultService);
    try {
      const entityResult = await service.create(req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
