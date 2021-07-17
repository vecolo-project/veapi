import { endOfDay, startOfDay, subDays } from 'date-fns';
import { Container, Service } from 'typedi';
import StationMonitoringService from './StationMonitoringService';
import UserService from './UserService';
import InvoiceService from './InvoiceService';
import SubscriptionService from './SubscriptionService';
import { Subscription } from '../entities/Subscription';

@Service()
export default class SchedulerService {
  private stationMonitoringService: StationMonitoringService;
  private userService: UserService;
  private invoiceService: InvoiceService;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.stationMonitoringService = Container.get(StationMonitoringService);
    this.userService = Container.get(UserService);
    this.invoiceService = Container.get(InvoiceService);
    this.subscriptionService = Container.get(SubscriptionService);
  }

  public async purgeMonitoring(): Promise<void> {
    const now = endOfDay(new Date());
    const end2DayAgo = endOfDay(subDays(now, 2));
    const start2DayAgo = startOfDay(end2DayAgo);
    const end7DayAgo = endOfDay(subDays(now, 7));
    const start7DayAgo = startOfDay(end7DayAgo);
    const end1MonthAgo = endOfDay(subDays(now, 30));
    const start1MonthAgo = startOfDay(end1MonthAgo);

    const result2Days = await this.stationMonitoringService
      .getRepo()
      .createQueryBuilder('stationMonitoring')
      .where(`station_monitoring.createdAt >= '${start2DayAgo.toISOString()}'`)
      .andWhere('station_monitoring.id mod 6 != 0')
      .delete()
      .execute();

    console.log(`Deleted ${result2Days.affected} lines past 2 days`);

    const result7Days = await this.stationMonitoringService
      .getRepo()
      .createQueryBuilder('stationMonitoring')
      .delete()
      .where(
        `station_monitoring.createdAt BETWEEN '${start7DayAgo.toISOString()}' AND '${start2DayAgo.toISOString()}'`
      )
      .andWhere('station_monitoring.id mod 60 != 0')
      .execute();
    console.log(`Deleted ${result7Days.affected} lines past 7 days`);

    const result1Month = await this.stationMonitoringService
      .getRepo()
      .createQueryBuilder('stationMonitoring')
      .delete()
      .where(
        `station_monitoring.createdAt BETWEEN '${start7DayAgo.toISOString()}' AND '${start1MonthAgo.toISOString()}'`
      )
      .andWhere('station_monitoring.id mod 180 != 0')
      .execute();
    console.log(`Deleted ${result1Month.affected} lines past 30 days`);

    await this.stationMonitoringService
      .getRepo()
      .query('optimize table station_monitoring');
  }

  public async genereateMonthlyUsersInvoice(): Promise<void> {
    for (const user of await this.userService.getRepo().find()) {
      const currentSubscription: Subscription =
        await this.subscriptionService.findLastFromUser(user.id);
      if (currentSubscription) {
        const invoice: any = {
          billingDate: new Date(),
          amount: currentSubscription.plan.price,
          user: user,
          subscription: currentSubscription,
        };
        await this.invoiceService.create(invoice);
      }
    }
  }
}
