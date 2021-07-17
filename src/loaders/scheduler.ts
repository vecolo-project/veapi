import * as schedule from 'node-schedule';
import { Container } from 'typedi';
import SchedulerService from '../api/services/SchedulerService';
import Logger from '../logger';

export default (): void => {
  schedule.scheduleJob('0 3 * * *', async () => {
    Logger.info('Batch purge monitoring execution');
    const service = Container.get(SchedulerService);
    await service.purgeMonitoring();
    Logger.info('Batch purge done');
  });

  schedule.scheduleJob('0 3 1 * *', async () => {
    Logger.info('Generate monthly subscriptions invoice');
    const service = Container.get(SchedulerService);
    await service.genereateMonthlyUsersInvoice();
    Logger.info('Subscription invoice generated');
  });
};
