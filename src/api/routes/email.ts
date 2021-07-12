import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import EmailSenderService from '../services/EmailSenderService';

const route = Router();
const sendSimpleUserMailCheck = celebrate({
  body: Joi.object({
    userId: Joi.number().min(1),
    subject: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
  }),
});
const sendNewsletterMailCheck = celebrate({
  body: Joi.object({
    subject: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
  }),
});
const defaultService = EmailSenderService;

route.post(
  '/simple',
  isAuth,
  checkRole(Role.STAFF),
  sendSimpleUserMailCheck,
  async (req, res, next) => {
    const service = Container.get(defaultService);
    try {
      await service.sendSimple(
        Number.parseInt(req.body.userId, 10),
        req.body.content,
        req.body.subject
      );
      return res.status(200).end();
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  '/newsletter',
  isAuth,
  checkRole(Role.STAFF),
  sendNewsletterMailCheck,
  async (req, res, next) => {
    const service = Container.get(defaultService);
    try {
      await service.sendNewsletter(req.body.content, req.body.subject);
      return res.status(200).end();
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
