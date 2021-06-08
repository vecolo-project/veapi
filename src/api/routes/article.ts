import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { attachUser, checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import ArticleService from '../services/ArticleService';
import { Container } from 'typedi';
import { userRequest } from '../../types/userRequest';
import { Article } from '../entities/Article';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    title: Joi.string().max(32).min(10).required(),
    content: Joi.string().required(),
    cover: Joi.string().required(),
  }),
});
const defaultService = ArticleService;
const basePath = '/article';

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

route.get(basePath, async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 20;
    let articles: Article[];
    if (typeof req.body.tags !== 'undefined') {
      const tags = escape(req.body.tags);
      articles = await service.searchByName(tags, { offset, limit });
    } else {
      articles = await service.find({ offset, limit });
    }
    return res.status(200).json(articles);
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
