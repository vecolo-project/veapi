import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { Container } from 'typedi';
import EmailSenderService from '../services/EmailSenderService';

const route = Router();
const sendSimpleUserMailCheck = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    subject: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
    username: Joi.string().min(1).required(),
  }),
});
const defaultService = EmailSenderService;

route.post('/user/simple', sendSimpleUserMailCheck, async (req, res, next) => {
  const service = Container.get(defaultService);
  try {
    const result = await service.sendSimple(
      req.body.email,
      req.body.content,
      req.body.subject,
      req.body.username
    );
    return res.status(200).json(result);
  } catch (e) {
    return next(e);
  }
});

export default route;
