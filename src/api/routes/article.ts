import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { attachUser, checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import ArticleService from '../services/ArticleService';
import { Container } from 'typedi';
import { userRequest } from '../../types/userRequest';
import { Article } from '../entities/Article';

const route = Router();

route.post(
  '/article',
  isAuth,
  checkRole(Role.STAFF),
  attachUser,
  celebrate({
    body: Joi.object({
      title: Joi.string().max(32).min(10).required(),
      content: Joi.string().required(),
      cover: Joi.string().required(),
    }),
  }),
  async (req: userRequest, res, next) => {
    const articleService = Container.get(ArticleService);
    req.body.author = req.currentUser.id;
    try {
      const article = await articleService.create(req.body);
      return res.status(201).json(article);
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/article', async (req, res, next) => {
  try {
    const articleService = Container.get(ArticleService);
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 20;
    let articles: Article[];
    if (req.body.tags != undefined) {
      const tags = escape(req.body.tags);
      articles = await articleService.searchByName(tags, { offset, limit });
    } else {
      articles = await articleService.find({ offset, limit });
    }
    return res.status(200).json(articles);
  } catch (e) {
    return next(e);
  }
});

route.get('/article/:id', async (req, res, next) => {
  try {
    const articleService = Container.get(ArticleService);
    const id = Number.parseInt(req.params.id);
    const articles = await articleService.findOne(id);
    return res.status(200).json(articles);
  } catch (e) {
    return next(e);
  }
});

route.delete('/article/:id', async (req, res, next) => {
  try {
    const articleService = Container.get(ArticleService);
    const id = Number.parseInt(req.params.id);
    const articles = await articleService.delete(id);
    return res.status(204).json(articles);
  } catch (e) {
    return next(e);
  }
});

export default route;
