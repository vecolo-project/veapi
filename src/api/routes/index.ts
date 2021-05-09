import { Router } from 'express';
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
routes.get('/', (req, res) => {
  res.send('Hello world !');
});
routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/swagger', swagger);

export default routes;
