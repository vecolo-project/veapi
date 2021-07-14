import { NextFunction, Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { attachUser, checkRole, isAuth } from '../middlewares';
import UserService from '../services/UserService';
import { userRequest } from '../../types/userRequest';
import { Role } from '../entities/User';
import { celebrate, Joi } from 'celebrate';
import bcrypt from 'bcrypt';
import { ErrorHandler } from '../../helpers/ErrorHandler';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    birthDate: Joi.date().max('now').required(),
    isActive: Joi.boolean().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
    pseudo: Joi.string().min(4).required(),
    newsletter: Joi.boolean().required(),
    role: Joi.string().allow('ADMIN', 'CLIENT', 'STAFF', 'STATION').required(),
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
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 20;
      const searchQuery = req.query.searchQuery || '';
      const { users, count } = await userServiceInstance.search(
        { offset, limit },
        searchQuery
      );
      return res.json({ users, count }).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

route.get(
  '/current',
  isAuth,
  attachUser,
  async (req: userRequest, res: Response) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling GET /user/current endpoint');

    const service = Container.get(defaultService);
    const entityResult = await service.findOne(req.currentUser.id);

    return res.json({ user: entityResult }).status(200);
  }
);

route.put(
  '/current',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      firstName: Joi.string().min(1).required(),
      lastName: Joi.string().min(1).required(),
      pseudo: Joi.string().min(4).required(),
      email: Joi.string().email(),
      role: Joi.forbidden(),
      password: Joi.forbidden(),
      birthDate: Joi.forbidden(),
    }),
  }),
  async (req: userRequest, res: Response, next: NextFunction) => {
    try {
      const service = Container.get(defaultService);
      const user = await service.update(req.currentUser.id, req.body);
      res.json(user);
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
      req.body.password = await bcrypt.hash(req.body.password, 12);
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
      //TODO delete dependency
      await service.delete(id);
      return res.status(204).end();
    } catch (e) {
      return next(e);
    }
  }
);

route.put(
  '/' + ':id',
  isAuth,
  checkRole(Role.ADMIN),
  celebrate({
    body: Joi.object({
      firstName: Joi.string().min(1).required(),
      lastName: Joi.string().min(1).required(),
      birthDate: Joi.date().max('now').required(),
      isActive: Joi.boolean().required(),
      password: Joi.string().min(7),
      email: Joi.string().email().required(),
      pseudo: Joi.string().min(4).required(),
      newsletter: Joi.boolean().required(),
      role: Joi.string()
        .allow('ADMIN', 'CLIENT', 'STAFF', 'STATION')
        .required(),
    }),
  }),
  async (req, res, next) => {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    try {
      if (req.body.password != undefined) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      }
      await service.update(id, req.body);
      const userUpdated = await service.findOne(id);
      return res.status(201).json(userUpdated);
    } catch (e) {
      return next(e);
    }
  }
);

route.patch(
  '/',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      firstName: Joi.string().min(1),
      lastName: Joi.string().min(1),
      birthDate: Joi.date().max('now'),
      email: Joi.string().email(),
      pseudo: Joi.string().min(4),
      newsletter: Joi.boolean(),
    }),
  }),
  async (req: userRequest, res, next) => {
    req.currentUser.firstName = req.body.firstName || req.currentUser.firstName;
    req.currentUser.lastName = req.body.lastName || req.currentUser.lastName;
    req.currentUser.birthDate = req.body.birthDate || req.currentUser.birthDate;
    req.currentUser.email = req.body.email || req.currentUser.email;
    req.currentUser.pseudo = req.body.pseudo || req.currentUser.pseudo;
    req.currentUser.newsletter =
      req.body.newsletter || req.currentUser.newsletter;
    const service = Container.get(defaultService);
    try {
      const entityResult = await service.update(
        req.currentUser.id,
        req.currentUser
      );
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.patch(
  '/password',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      actualPassword: Joi.string().required(),
      newPassword: Joi.string().min(4).required(),
      confirmNewPassword: Joi.string()
        .min(4)
        .required()
        .valid(Joi.ref('newPassword')),
    }),
  }),
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    try {
      const currentUser = await service.findOneWithPassword(req.currentUser.id);
      console.log(currentUser);
      const passwordMatch = await bcrypt.compare(
        req.body.actualPassword,
        currentUser.password
      );
      if (!passwordMatch) {
        throw new ErrorHandler(400, `le mot de passe actuel n'est pas correct`);
      }
      currentUser.password = await bcrypt.hash(req.body.newPassword, 12);
      await service.update(currentUser.id, currentUser);
      return res.status(200).end();
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
