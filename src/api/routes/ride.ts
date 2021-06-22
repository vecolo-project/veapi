import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { attachUser, checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import { userRequest } from '../../types/userRequest';
import RideService from '../services/RideService';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    duration: Joi.number().min(0).required(),
    startStation: Joi.number().min(0).required(),
    endStation: Joi.number().min(0).required(),
    user: Joi.number().min(0).required(),
    rideLength: Joi.number().min(0).required(),
    invoiceAmount: Joi.number().min(0).required(),
  }),
});
const defaultService = RideService;
const basePath = '/ride/';

route.post(basePath, isAuth, checkRole(Role.STAFF), async (req, res, next) => {
  const service = Container.get(defaultService);
  try {
    const entityResult = await service.create(req.body);
    return res.status(201).json(entityResult);
  } catch (e) {
    return next(e);
  }
});

route.get(basePath, isAuth, checkRole(Role.STAFF), async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 20;
    const result = await service.find({ offset, limit });
    return res.status(200).json(result);
  } catch (e) {
    return next(e);
  }
});

route.get(
  basePath + ':id',
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
  basePath + ':id',
  isAuth,
  checkRole(Role.ADMIN),
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
  basePath + ':id',
  isAuth,
  checkRole(Role.ADMIN),
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

route.post(
  basePath + 'order/',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      startStation: Joi.number().min(0).required(),
      bike: Joi.number().min(0).required(),
    }),
  }),
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    req.body.user = req.currentUser.id;
    req.body.endStation = 0;
    req.body.duration = 0;
    req.body.rideLength = 0;
    req.body.invoiceAmount = 0;
    try {
      const entityResult = await service.create(req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.patch(
  basePath + 'order/:id',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      endStation: Joi.number().min(0).required(),
      rideLength: Joi.number().min(0).required(),
    }),
  }),
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    try {
      const id = Number.parseInt(req.params.id);
      const currentRide = await service.findOne(id);
      if (currentRide.user.id != req.currentUser.id) {
        res.status(401);
        return;
      }
      req.body.duration =
        Date.now().valueOf() - currentRide.createdAt.valueOf();
      const entityResult = await service.update(id, req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get(
  basePath + 'me/:id',
  isAuth,
  attachUser,
  async (req: userRequest, res, next) => {
    try {
      const service = Container.get(defaultService);
      const id = Number.parseInt(req.params.id);
      const entityResult = await service.findOne(id);
      if (entityResult.user.id != req.currentUser.id) {
        res.status(401);
        return;
      }
      return res.status(200).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get(
  basePath + 'me/',
  isAuth,
  attachUser,
  async (req: userRequest, res, next) => {
    try {
      const service = Container.get(defaultService);
      const offset = req.body.offset || 0;
      const limit = req.body.limit || 20;
      const result = await service.getAllRideFromUser(req.currentUser.id, {
        offset,
        limit,
      });
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
