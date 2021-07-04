import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import PlanService from '../services/PlanService';
import SubscriptionService from '../services/SubscriptionService';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().max(30).min(3).required(),
    price: Joi.number().required(),
    costPerMinute: Joi.number().required(),
    isUnlimited: Joi.boolean().required(),
  }),
});
const defaultService = PlanService;

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

route.get('/', async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const plans = await service.find({ offset, limit });
    const count = await service.getRepo().count();
    return res.status(200).json({ plans, count });
  } catch (e) {
    return next(e);
  }
});

route.get('/' + ':id', async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    const entityResult = await service.findOne(id);
    return res.status(200).json(entityResult);
  } catch (e) {
    return next(e);
  }
});

route.delete(
  '/' + ':id',
  isAuth,
  checkRole(Role.ADMIN),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const dependencyService = Container.get(SubscriptionService);
      const id = Number.parseInt(req.params.id);
      const dependency = await dependencyService.getAllFromPlan(id, {
        limit: 1,
        offset: 0,
      });
      if (dependency.length > 0) {
        res
          .status(403)
          .json({ message: 'Impossible de supprimmer ce forfait' });
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

export default route;
