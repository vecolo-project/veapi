import { Router } from 'express';
import auth from './auth';
import user from './user';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('Hello world !');
});
routes.use('/auth', auth);
routes.use('/user', user);

export default routes;
