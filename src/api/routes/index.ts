import { Router } from 'express';
import auth from './auth';
import user from './user';
import station from './station';
import stationMonitoring from './stationMonitoring';
import article from './article';
import bike from './bike';
import bikeMaintenance from './bikeMaintenaceThread';
import invoice from './invoice';
import issue from './issue';
import issueThread from './issueThread';
import plan from './plan';
import ride from './ride';
import stationMaintenance from './stationMaintenanceThread';
import subscription from './subscription';
import bikeManufacturer from './bikeManufacturer';
import bikeModel from './bikeModel';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('Hello world !');
});
routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/station', station);
routes.use('/station-monitoring', stationMonitoring);
routes.use('/article', article);
routes.use('/bike', bike);
routes.use('/bike-manufacturer', bikeManufacturer);
routes.use('/bike-model', bikeModel);
routes.use('bikeMaintenance', bikeMaintenance);
routes.use('invoice', invoice);
routes.use('issue', issue);
routes.use('issueThread', issueThread);
routes.use('plan', plan);
routes.use('ride', ride);
routes.use('stationMaintenance', stationMaintenance);
routes.use('subscription', subscription);

export default routes;
