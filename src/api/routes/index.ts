import { Router } from 'express';
import auth from './auth';
import user from './user';
import station from './station';
import stationMonitoring from './stationMonitoring';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('Hello world !');
});
routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/station', station);
routes.use('/station-monitoring', stationMonitoring);

export default routes;
