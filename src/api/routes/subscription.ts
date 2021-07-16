import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { attachUser, checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import SubscriptionService from '../services/SubscriptionService';
import { userRequest } from '../../types/userRequest';
import InvoiceService from '../services/InvoiceService';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    id: Joi.number().optional(),
    startDate: Joi.date().required(),
    monthDuration: Joi.number().min(1).required(),
    autoRenew: Joi.boolean().required(),
    plan: Joi.object().min(0).required(),
    user: Joi.object().min(0).required(),
  }),
});
const defaultService = SubscriptionService;

route.post(
  '/',
  isAuth,
  checkRole(Role.ADMIN),
  paramsRules,
  async (req, res, next) => {
    const service = Container.get(defaultService);
    try {
      const entityResult = await service.createS(req.body, req.body.user);
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
    const subscriptions = await service.getAllWithRelation({ offset, limit });
    const count = await service.getRepo().count();
    return res.status(200).json({ subscriptions, count });
  } catch (e) {
    return next(e);
  }
});

route.delete(
  '/:id',
  isAuth,
  checkRole(Role.ADMIN),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const dependencyService = Container.get(InvoiceService);
      const id = Number.parseInt(req.params.id);
      const dependency = await dependencyService.getAllFromSubscription(id, {
        limit: 1,
        offset: 0,
      });
      if (dependency.length > 0) {
        res
          .status(403)
          .json({ message: 'Impossible de supprimer cette inscription' });
        return;
      }
      await service.delete(id);
      return res.status(204).end();
    } catch (e) {
      return next(e);
    }
  }
);

route.put(
  '/:id',
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

route.get('/me', isAuth, attachUser, async (req: userRequest, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const [subscriptions, count] = await service.getAllFromUser(
      req.currentUser.id,
      {
        offset,
        limit,
      }
    );
    return res.status(200).json({ subscriptions, count });
  } catch (e) {
    return next(e);
  }
});

route.get(
  '/current',
  isAuth,
  attachUser,
  async (req: userRequest, res, next) => {
    try {
      const service = Container.get(defaultService);
      const subscription = await service.findLastFromUser(req.currentUser.id);
      return res.status(200).json(subscription);
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/:id', isAuth, checkRole(Role.STAFF), async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    const entityResult = await service.getOneWithRelation(id);
    return res.status(200).json(entityResult);
  } catch (e) {
    return next(e);
  }
});

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
      const [subscriptions, count] = await service.getAllFromUser(userId, {
        offset,
        limit,
      });
      return res.status(200).json({ subscriptions, count });
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/me/:id', isAuth, attachUser, async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    const entityResult = await service.findOne(id);
    return res.status(200).json(entityResult);
  } catch (e) {
    return next(e);
  }
});

route.post(
  '/add/',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      startDate: Joi.date().required(),
      monthDuration: Joi.number().min(1).required(),
      autoRenew: Joi.boolean().required(),
      plan: Joi.number().min(0).required(),
    }),
  }),
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    try {
      req.body.user = req.currentUser.id;
      const entityResult = await service.createS(req.body, req.currentUser);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.delete(
  '/cancel/:id',
  isAuth,
  attachUser,
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    try {
      const previous = await service.findOne(id);
      if (previous.user.id != req.currentUser.id) {
        res.status(401);
        return;
      }
      previous.autoRenew = false;
      previous.monthDuration =
        (Date.prototype.getFullYear() - previous.createdAt.getFullYear()) * 12 -
        Date.prototype.getMonth() +
        previous.createdAt.getMonth() +
        1;
      const entityResult = await service.update(id, previous);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
