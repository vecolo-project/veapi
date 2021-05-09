import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import UserService from '../services/UserService';
import { Logger } from 'winston';

const route = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: login
 */
route.post(
  '/register',
  celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
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

/**
 * @swagger
 * /user/login:
 *    post:
 *     description: Login to the application
 *     parameters:
 *     - in: "body"
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Book'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: login
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Book'
 */
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

export default route;
