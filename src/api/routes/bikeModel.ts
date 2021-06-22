import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import BikeModelService from '../services/BikeModelService';
import BikeService from '../services/BikeService';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    name: Joi.string().max(32).required(),
    batteryCapacity: Joi.number().min(0).required(),
    weight: Joi.number().min(0).required(),
    maxPower: Joi.number().min(0).required(),
    maxSpeed: Joi.number().min(0).required(),
    maxDistance: Joi.number().min(0).required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    icon: Joi.string().required(),
    bikeManufacturer: Joi.number().min(0).required(),
  }),
});
const basePath = '/bikeModel/';
const defaultService = BikeModelService;

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
      const serviceBike = Container.get(BikeService);
      const id = Number.parseInt(req.params.id);
      const dependency = await serviceBike.getAllByModel(id);
      if (dependency.length != 0)
        return res
          .status(403)
          .json({ message: 'Impossible de supprimer ce model' });
      await service.delete(id);
      return res.status(204).json();
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
