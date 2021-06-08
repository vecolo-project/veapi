import { Router } from 'express';
import { attachUser, checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import { userRequest } from '../../types/userRequest';
import BikeMaintenanceThreadService from '../services/BikeMaintenanceThreadService';
import BikeModelService from "../services/BikeModelService";

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    title: Joi.string().min(10).max(64).required(),
    content: Joi.string().min(10).required(),
    bikeBreakdown: Joi.number().min(0).required(),
    user: Joi.number().min(0).required(),
  }),
});
const basePath = '/bikeMaintenance';
const defaultService = BikeMaintenanceThreadService;

route.post(
  basePath,
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      title: Joi.string().min(10).max(64).required(),
      content: Joi.string().min(10).required(),
      bikeBreakdown: Joi.number().min(0).required(),
    }),
  }),
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    req.body.user = req.currentUser.id;
    try {
      const entityResult = await service.create(req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get(basePath, isAuth, async (req, res, next) => {
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

route.get(basePath + ':id', isAuth, async (req, res, next) => {
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
      const serviceBikeModel = Container.get(BikeModelService);
      const model = await serviceBikeModel.getAllFromManufacturer(id);
      if (model.length != 0)
        return res
          .status(403)
          .json({ message: 'Impossible de supprimer ce constructeur' });
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

route.patch(
  basePath + 'id',
  isAuth,
  attachUser,
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
