import { endOfDay, startOfDay, subDays } from 'date-fns';
import { Container, Service } from 'typedi';
import StationMonitoringService from './StationMonitoringService';

@Service()
export default class SchedulerService {
  private stationMonitoringService: StationMonitoringService;

  constructor() {
    this.stationMonitoringService = Container.get(StationMonitoringService);
  }

  public async purgeMonitoring(): Promise<void> {
    const now = endOfDay(new Date());
    const end2DayAgo = endOfDay(subDays(now, 2));
    const start2DayAgo = startOfDay(end2DayAgo);
    const end7DayAgo = endOfDay(subDays(now, 7));
    const start7DayAgo = startOfDay(end7DayAgo);
    const end1MonthAgo = endOfDay(subDays(now, 30));
    const start1MonthAgo = startOfDay(end1MonthAgo);

    await this.stationMonitoringService
      .getRepo()
      .createQueryBuilder('stationMonitoring')
      .delete()
      .where(`stationMonitoring.createdAt >= '${start2DayAgo.toISOString()}'`)
      .andWhere('stationMonitoring.id mod 6 != 0');

    await this.stationMonitoringService
      .getRepo()
      .createQueryBuilder('stationMonitoring')
      .delete()
      .where(
        `stationMonitoring.createdAt BETWEEN '${start7DayAgo.toISOString()}' AND '${start2DayAgo.toISOString()}'`
      )
      .andWhere('stationMonitoring.id mod 60 != 0');

    await this.stationMonitoringService
      .getRepo()
      .createQueryBuilder('stationMonitoring')
      .delete()
      .where(
        `stationMonitoring.createdAt BETWEEN '${start7DayAgo.toISOString()}' AND '${start1MonthAgo.toISOString()}'`
      )
      .andWhere('stationMonitoring.id mod 180 != 0');

    await this.stationMonitoringService
      .getRepo()
      .query('optimize table station_monitoring');
  }
}
