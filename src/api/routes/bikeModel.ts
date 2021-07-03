import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import { UploadedFile } from 'express-fileupload';
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
    bikeManufacturer: Joi.number().min(0).required(),
  }),
});
const defaultService = BikeModelService;

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

route.get('/', async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const entityResult = await service.find({ offset, limit });
    return res.status(200).json(entityResult);
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

route.post(
  '/add-image',
  isAuth,
  checkRole(Role.STAFF),
  async (req, res, next) => {
    const service = Container.get(defaultService);
    console.log(req.files);
    if (!req.files) {
      return res.status(400).send('No files provided');
    }
    try {
      const file = req.files[0] as UploadedFile;
      service.handleImageUpload(file);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
