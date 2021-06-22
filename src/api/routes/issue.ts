import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { attachUser, checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import IssueService from '../services/IssueService';
import { userRequest } from '../../types/userRequest';
import { IssueStatus } from '../entities/Issue';
import IssueThreadService from '../services/IssueThreadService';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    title: Joi.string().min(1).max(64).required(),
    content: Joi.string().min(1).required(),
    attachedFiles: Joi.string().optional(),
    type: Joi.string().allow('BIKE', 'STATION').required(),
    status: Joi.string().allow('CREATED', 'DONE', 'IN PROGRESS').required(),
    creator: Joi.number().min(1).required(),
  }),
});
const defaultService = IssueService;

route.post(
  '/' + 'report/',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      title: Joi.string().min(1).max(64).required(),
      content: Joi.string().min(1).required(),
      attachedFiles: Joi.string().optional(),
      type: Joi.string().allow('BIKE', 'STATION').required(),
    }),
  }),
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    req.body.creator = req.currentUser.id;
    req.body.status = IssueStatus.CREATED;
    try {
      const entityResult = await service.create(req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

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
      const dependencyService = Container.get(IssueThreadService);
      const dependency = await dependencyService.getAllFromIssue(id);
      if (dependency.length != 0)
        return res
          .status(403)
          .json({ message: 'Impossible de supprimer ce report' });
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

export default route;
