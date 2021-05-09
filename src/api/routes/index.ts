import { Router } from 'express';
import { Get, Route } from 'tsoa';
import auth from './auth';
import user from './user';
import swagger from './swagger';

const routes = Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to Vécolo API
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
@Get('/')
routes.get('/', (req, res) => {
  res.send('Hello world !');
});
@Route('auth')
routes.use('/auth', auth);
@Route('user')
routes.use('/user', user);
routes.use('/swagger', swagger);

export default routes;
