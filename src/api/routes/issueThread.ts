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
const defaultService = IssueThreadService;

route.post(
  '/',
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
  '/' + ':id',
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
  '/' + 'message/:id',
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

route.get('/', isAuth, checkRole(Role.STAFF), async (req, res, next) => {
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
