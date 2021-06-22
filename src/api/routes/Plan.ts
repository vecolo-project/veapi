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
    name: Joi.string().max(32).min(10).required(),
    price: Joi.number().required(),
    costPerMinute: Joi.number().required(),
    isUnlimited: Joi.boolean().required(),
  }),
});
const defaultService = PlanService;
const basePath = '/plan/';

route.post(
  basePath,
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

route.get(basePath, async (req, res, next) => {
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

route.get(basePath + ':id', async (req, res, next) => {
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
  basePath + ':id',
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

export default route;
