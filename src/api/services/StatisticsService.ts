import { Container, Service } from 'typedi';
import UserService from './UserService';
import PlanService from './PlanService';
import SubscriptionService from './SubscriptionService';
import BikeService from './BikeService';
import InvoiceService from './InvoiceService';
import StationService from './StationService';
import { endOfMonth, setMonth, setYear, startOfMonth } from 'date-fns';
import RideService from './RideService';
import { Between } from 'typeorm';
import { Station } from '../entities/Station';

@Service()
export default class StatisticsService {
  private userService: UserService;
  private planService: PlanService;
  private subscriptionService: SubscriptionService;
  private bikeService: BikeService;
  private invoiceService: InvoiceService;
  private stationService: StationService;
  private rideService: RideService;

  constructor() {
    this.userService = Container.get(UserService);
    this.planService = Container.get(PlanService);
    this.subscriptionService = Container.get(SubscriptionService);
    this.bikeService = Container.get(BikeService);
    this.invoiceService = Container.get(InvoiceService);
    this.stationService = Container.get(StationService);
    this.rideService = Container.get(RideService);
  }

  async getSubscriptionsRepartitions(): Promise<any> {
    return await this.subscriptionService
      .getRepo()
      .createQueryBuilder('subscription')
      .leftJoin('plan', 'plan', 'subscription.planId = plan.id')
      .select('COUNT(subscription.id)', 'total')
      .addSelect('plan.name', 'planName')
      .addSelect('plan.id', 'planId')
      .groupBy('subscription.planId')
      .getRawMany();
  }

  async getMonthIncome(month: number, year: number): Promise<any> {
    const startDate = startOfMonth(setYear(setMonth(new Date(), month), year));
    const endDate = endOfMonth(startDate);

    const totalSubscription = await this.subscriptionService
      .getRepo()
      .createQueryBuilder('subscription')
      .leftJoin('plan', 'p', 'p.id = subscription.planId')
      .select('SUM(p.price)', 'totalSubscription')
      .where(
        "p.createdAt BETWEEN '" +
          startDate.toISOString() +
          "' AND '" +
          endDate.toISOString() +
          "'"
      )
      .getRawOne();

    const totalRide = await this.rideService
      .getRepo()
      .createQueryBuilder('ride')
      .select('SUM(ride.invoiceAmount)', 'totalRide')
      .where(
        "ride.createdAt BETWEEN '" +
          startDate.toISOString() +
          "' AND '" +
          endDate.toISOString() +
          "'"
      )
      .getRawOne();
    return { ...totalSubscription, ...totalRide };
  }

  async getMonthUserSubscription(month: number, year: number): Promise<any> {
    const startDate = startOfMonth(setYear(setMonth(new Date(), month), year));
    const endDate = endOfMonth(startDate);
    return await this.userService.getRepo().count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
  }

  async getRideMonthCount(month: number, year: number): Promise<any> {
    const startDate = startOfMonth(setYear(setMonth(new Date(), month), year));
    const endDate = endOfMonth(startDate);

    return await this.rideService
      .getRepo()
      .createQueryBuilder('ride')
      .select('COUNT(ride.id)', 'totalRide')
      .addSelect('DAY(ride.createdAt)', 'day')
      .addSelect('SUM(ride.rideLength)', 'totalLength')
      .where(
        "ride.createdAt BETWEEN '" +
          startDate.toISOString() +
          "' AND '" +
          endDate.toISOString() +
          "'"
      )
      .groupBy('day(ride.createdAt)')
      .getRawMany();
  }

  async getActiveStation(): Promise<any> {
    return (
      await this.stationService.findAll({ limit: 99999, offset: 0 })
    ).reduce(
      (acumulator, station: Station) => {
        return {
          total:
            acumulator.total + (station.stationMonitoring[0]?.isActive ? 1 : 0),
          power:
            acumulator.power +
            (station.stationMonitoring[0]?.isActive
              ? station.stationMonitoring[0]?.chargingPower || 0
              : 0),
        };
      },
      { total: 0, power: 0 }
    );
  }

  async getBikes(): Promise<any> {
    return await this.bikeService
      .getRepo()
      .createQueryBuilder('bike')
      .select('COUNT(bike.id)', 'total')
      .addSelect('bike.status', 'status')
      .groupBy('bike.status')
      .getRawMany();
  }
}
