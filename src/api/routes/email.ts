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
const sendContactFormMailCheck = celebrate({
  body: Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    content: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    enterprise: Joi.string().optional(),
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

route.post('/contact', sendContactFormMailCheck, async (req, res, next) => {
  const service = Container.get(defaultService);
  try {
    await service.sendContactForm(
      req.body.firstname,
      req.body.lastname,
      req.body.content,
      req.body.email,
      req.body.phone,
      req.body.enterprise || null
    );
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
});

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
