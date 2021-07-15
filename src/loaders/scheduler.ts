import * as schedule from 'node-schedule';
import { Container } from 'typedi';
import SchedulerService from '../api/services/SchedulerService';

export default (): void => {
  schedule.scheduleJob('0 3 * * *', async () => {
    console.log('Batch purge monitoring execution');
    const service = Container.get(SchedulerService);
    service.purgeMonitoring();
  });
};
