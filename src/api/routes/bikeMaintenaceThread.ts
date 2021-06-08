import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import BikeService from "../services/BikeService";
import { checkRole, isAuth } from "../middlewares";
import { Role } from "../entities/User";
import { Container } from "typedi";

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    matriculate: Joi.string().max(32).min(10).required(),
    station: Joi.number().min(0).required(),
    batteryPercent: Joi.number().min(0).max(100).required(),
    recharging: Joi.boolean().required(),
    model: Joi.number().min(0).required(),
    status: Joi.string()
      .allow('OFF', 'MAINTAINING', 'IN_RIDE', 'RECHARGING')
      .required(),
  }),
});
const basePath = '/bike';
const defaultService = BikeService;

route.post(
  basePath,
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

route.get(basePath, async (req, res, next) => {
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
  basePath + ':id',
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
