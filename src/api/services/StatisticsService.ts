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
    const monthCount = await this.userService.getRepo().count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
    const total = await this.userService.getRepo().count();
    return { monthCount, total };
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
      .addSelect('SUM(ride.duration)', 'totalDuration')
      .where(
        `ride.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`
      )
      .groupBy('day(ride.createdAt)')
      .getRawMany();
  }

  async getActiveStation(): Promise<{ total: number; power: number }> {
    const allStation = await this.stationService.findAll({
      limit: 99999,
      offset: 0,
    });
    const activeStations = allStation.reduce(
      (acc, station) => {
        const stationIsActive = station.stationMonitoring[0]?.isActive;
        const total = acc.total + Number(stationIsActive);
        let additionnalPower = 0;
        if (stationIsActive) {
          additionnalPower = station.stationMonitoring[0]?.chargingPower;
        }
        const power = acc.power + additionnalPower;
        return { power, total };
      },
      { total: 0, power: 0 }
    );
    return activeStations;
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
