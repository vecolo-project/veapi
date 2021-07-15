import * as schedule from 'node-schedule';
import {Container} from 'typedi';
import StationMonitoringService from '../api/services/StationMonitoringService';

export default (): void => {
  schedule.scheduleJob('* * * * *', async () => {
    console.log('CRON');
    const service = Container.get(StationMonitoringService);
    console.log(await service.getRepo().count());
  });
};
