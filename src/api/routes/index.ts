import { Router } from 'express';
import auth from './auth';
import user from './user';
import station from './station';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('Hello world !');
});
routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/station', station);

export default routes;
