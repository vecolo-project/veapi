import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import BikeMaintenanceThreadService from '../services/BikeMaintenanceThreadService';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    title: Joi.string().min(10).max(64).required(),
    content: Joi.string().min(10).required(),
    bikeBreakdown: Joi.number().min(0).required(),
    user: Joi.number().min(0).required(),
  }),
});
const defaultService = BikeMaintenanceThreadService;

route.post(
  '/',
  isAuth,
  checkRole(Role.STAFF),
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
    const entityResult = await service.find({ offset, limit });
    return res.status(200).json(entityResult);
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
  checkRole(Role.STAFF),
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
  checkRole(Role.STAFF),
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

route.patch(
  '/' + 'id',
  isAuth,
  checkRole(Role.STAFF),
  celebrate({
    body: Joi.object({
      title: Joi.string().min(10).max(64),
      content: Joi.string().min(10),
      bikeBreakdown: Joi.number().min(0),
    }),
  }),
  async (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    const service = Container.get(defaultService);
    try {
      const previous = await service.findOne(id);
      if (!previous) return res.status(400);
      req.body.title = req.body.title || previous.title;
      req.body.content = req.body.content || previous.content;
      req.body.bikeBreakdown = req.body.bikeBreakdown || previous.bikeBreakdown;
      const entityResult = await service.update(id, req.body);
      return res.status(200).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
