import { Router } from 'express';
import { attachUser, checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import IssueThreadService from '../services/IssueThreadService';
import { userRequest } from '../../types/userRequest';
import IssueService from '../services/IssueService';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    content: Joi.string().min(1).required(),
    issue: Joi.number().min(0).required(),
  }),
});
const basePath = '/issueThread/';
const defaultService = IssueThreadService;

route.post(
  basePath,
  isAuth,
  checkRole(Role.STAFF),
  attachUser,
  paramsRules,
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    req.body.author = req.currentUser.id;
    try {
      const entityResult = await service.create(req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  basePath + ':id',
  isAuth,
  checkRole(Role.STAFF),
  attachUser,
  paramsRules,
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    req.body.author = req.currentUser.id;
    const id = Number.parseInt(req.params.id);
    req.body.issue = id;
    try {
      const entityResult = await service.create(req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  basePath + 'message/:id',
  isAuth,
  attachUser,
  paramsRules,
  async (req: userRequest, res, next) => {
    const service = Container.get(defaultService);
    req.body.author = req.currentUser.id;
    const id = Number.parseInt(req.params.id);
    req.body.issue = id;
    try {
      const issueService = Container.get(IssueService);
      const thread = await issueService.findOne(id);
      if (thread.id != req.currentUser.id) {
        res.status(403);
        return;
      }
      const entityResult = await service.create(req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get(basePath, isAuth, checkRole(Role.STAFF), async (req, res, next) => {
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
