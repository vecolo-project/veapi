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
    id: Joi.number().optional(),
    duration: Joi.number().min(0).required(),
    startStation: Joi.object().required(),
    endStation: Joi.object().required(),
    user: Joi.object().required(),
    bike: Joi.object().required(),
    rideLength: Joi.number().min(0).required(),
    invoiceAmount: Joi.number().min(0).required(),
    createdAt: Joi.date().optional(),
  }),
});

const startRideRules = celebrate({
  body: Joi.object({
    startStation: Joi.object().required(),
    bike: Joi.object().required(),
  }),
});

const endRideRules = celebrate({
  body: Joi.object({
    endStation: Joi.object().required(),
    ride: Joi.object().required(),
    length: Joi.number().min(1),
  }),
});

const defaultService = RideService;

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
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const searchQuery = req.query.searchQuery || '';
    const [rides, count] = await service.search({ offset, limit }, searchQuery);
    return res.status(200).json({ rides, count });
  } catch (e) {
    return next(e);
  }
});

route.get(
  '/station/:id',
  isAuth,
  checkRole(Role.STAFF),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 20;

      const id = Number.parseInt(req.params.id);
      const rides = await service.getAllRideFromStation(id, {
        limit,
        offset,
      });
      const count = await service
        .getRepo()
        .count({ where: [{ startStation: { id } }, { endStation: { id } }] });
      return res.status(200).json({ rides, count });
    } catch (e) {
      return next(e);
    }
  }
);

route.get(
  '/bike/:id',
  isAuth,
  checkRole(Role.STAFF),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 20;

      const id = Number.parseInt(req.params.id);
      const [rides, count] = await service.getAllRideFromBike(id, {
        limit,
        offset,
      });
      return res.status(200).json({ rides, count });
    } catch (e) {
      return next(e);
    }
  }
);

route.delete('/:id', isAuth, checkRole(Role.STAFF), async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    await service.delete(id);
    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

route.put(
  '/' + ':id',
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
  '/start',
  isAuth,
  attachUser,
  startRideRules,
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    try {
      const entityResult = await service.startRide(
        req.body.bike,
        req.body.startStation,
        req.currentUser
      );
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  '/end',
  isAuth,
  attachUser,
  endRideRules,
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    try {
      const entityResult = await service.endRide(
        req.currentUser,
        req.body.ride,
        req.body.endStation,
        req.body.length
      );
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);
route.get(
  '/current',
  isAuth,
  attachUser,
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    try {
      const entityResult = await service.getCurrentRide(req.currentUser);
      return res.status(200).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/me/', isAuth, attachUser, async (req: userRequest, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const [rides, count] = await service.getAllRideFromUser(
      req.currentUser.id,
      {
        offset,
        limit,
      }
    );
    return res.status(200).json({ rides, count });
  } catch (e) {
    return next(e);
  }
});

route.get(
  '/me/:id',
  isAuth,
  attachUser,
  async (req: userRequest, res, next) => {
    try {
      const service = Container.get(defaultService);
      const id = Number.parseInt(req.params.id);
      const entityResult = await service.findOne(id);
      if (entityResult.user.id != req.currentUser.id) {
        res.status(401).end();
        return;
      }
      return res.status(200).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get(
  '/user/:id',
  isAuth,
  checkRole(Role.STAFF),
  async (req: userRequest, res, next) => {
    try {
      const service = Container.get(defaultService);
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 20;
      const userId = Number.parseInt(req.params.id, 10);
      const [rides, count] = await service.getAllRideFromUser(userId, {
        offset,
        limit,
      });
      return res.status(200).json({ rides, count });
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/:id', isAuth, checkRole(Role.STAFF), async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    const entityResult = await service.findOne(id);
    return res.status(200).json(entityResult);
  } catch (e) {
    return next(e);
  }
});

export default route;
