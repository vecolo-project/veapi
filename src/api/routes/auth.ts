import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import UserService from '../services/UserService';
import { Logger } from 'winston';
import { attachUser, isAuth } from '../middlewares';
import { userRequest } from '../../types/userRequest';
import bcrypt from 'bcrypt';
import EmailSenderService from '../services/EmailSenderService';

const route = Router();

route.post(
  '/register',
  celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      birthDate: Joi.date().required(),
      pseudo: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling /register endpoint with body: %o', req.body);
    try {
      const userServiceInstance = Container.get(UserService);
      const { user, token } = await userServiceInstance.register(req.body);
      return res.status(201).json({ user, token });
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  '/login',
  celebrate({
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling /login endpoint with email: %s', req.body.email);
    try {
      const userServiceInstance = Container.get(UserService);
      const { user, token } = await userServiceInstance.login(
        req.body.email,
        req.body.password
      );
      return res.json({ user, token }).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  '/reset-password',
  celebrate({
    body: Joi.object({
      token: Joi.string().required(),
      newPassword: Joi.string().min(4).required(),
      confirmNewPassword: Joi.string()
        .min(4)
        .required()
        .valid(Joi.ref('newPassword')),
    }),
  }),
  async (req: userRequest, res, next) => {
    const service = Container.get(UserService);
    try {
      const currentUser = await service.findOneByResetToken(req.body.token);
      if (!currentUser) {
        return res.status(403).json({
          error: 'Token non valide',
        });
      }
      currentUser.password = await bcrypt.hash(req.body.newPassword, 12);
      currentUser.resetPasswordToken = '';
      await service.update(currentUser.id, currentUser);
      return res.status(200).end();
    } catch (e) {
      return next(e);
    }
  }
);
route.get(
  '/forgot-password',
  celebrate({
    query: Joi.object({
      email: Joi.string().required(),
    }),
  }),
  async (req: userRequest, res, next) => {
    const userService = Container.get(UserService);
    const emailSenderService = Container.get(EmailSenderService);
    try {
      const currentUser = await userService.findOneByEmail(
        req.query.email?.toString()
      );
      if (!currentUser) {
        return res.status(403).json({
          error: 'Email non valide',
        });
      }
      const resetLink = await userService.generatePasswordToken(currentUser);
      await emailSenderService.sendResetPassword(
        currentUser.firstName,
        currentUser.lastName,
        currentUser.email,
        resetLink
      );
      return res.status(200).end();
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
