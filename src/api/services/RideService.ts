import { Container, Inject, Service } from 'typedi';
import CRUD, { getAllParams } from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Ride, RideRepository } from '../entities/Ride';
import { Bike } from '../entities/Bike';
import { Station } from '../entities/Station';
import { User } from '../entities/User';
import SubscriptionService from './SubscriptionService';

@Service()
export default class RideService extends CRUD<Ride> {
  private subscriptionService: SubscriptionService;
  constructor(
    @InjectRepository(Ride)
    protected rideRepo: RideRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(rideRepo, logger);
    this.subscriptionService = Container.get(SubscriptionService);
  }

  async getAllRideFromUser(
    id: number,
    param: getAllParams
  ): Promise<[Ride[], number]> {
    return await this.rideRepo.findAndCount({
      where: { user: { id } },
      skip: param.offset,
      take: param.limit,
      relations: ['bike', 'startStation', 'endStation'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllRideFromBike(
    id: number,
    param?: getAllParams
  ): Promise<[Ride[], number]> {
    return await this.rideRepo.findAndCount({
      where: {
        bike: { id },
      },
      skip: param.offset,
      take: param.limit,
      relations: ['user', 'bike', 'startStation', 'endStation'],
    });
  }

  async getAllRideFromStation(
    id: number,
    param: getAllParams
  ): Promise<Ride[]> {
    return await this.rideRepo.find({
      where: [{ startStation: { id } }, { endStation: { id } }],
      skip: param.offset,
      take: param.limit,
      relations: ['user', 'bike', 'startStation', 'endStation'],
    });
  }

  async findOne(id: number): Promise<Ride> {
    return await this.rideRepo.findOne(id, {
      relations: [
        'user',
        'bike',
        'bike.model',
        'bike.model.bikeManufacturer',
        'startStation',
        'endStation',
      ],
    });
  }

  async search(
    param: getAllParams,
    searchQuery?: any
  ): Promise<[Ride[], number]> {
    /*    return await this.rideRepo.findAndCount({
      skip: param.offset,
      take: param.limit,
      relations: ['user', 'bike', 'startStation', 'endStation'],
    });*/

    const result = await this.rideRepo
      .createQueryBuilder('ride')
      .leftJoinAndSelect('ride.user', 'user')
      .leftJoinAndSelect('ride.bike', 'bike')
      .leftJoinAndSelect('ride.startStation', 'startStation')
      .leftJoinAndSelect('ride.endStation', 'endStation')
      .where(`ride.duration LIKE('%${searchQuery}%')`)
      .orWhere(`ride.rideLength LIKE('%${searchQuery}%')`)
      .orWhere(`ride.invoiceAmount LIKE('%${searchQuery}%')`)
      .orWhere(`startStation.streetNumber LIKE('%${searchQuery}%')`)
      .orWhere(`startStation.streetName LIKE('%${searchQuery}%')`)
      .orWhere(`startStation.city LIKE('%${searchQuery}%')`)
      .orWhere(`startStation.zipcode LIKE('%${searchQuery}%')`)
      .orWhere(`endStation.streetNumber LIKE('%${searchQuery}%')`)
      .orWhere(`startStation.id LIKE('%${searchQuery}%')`)
      .orWhere(`endStation.id LIKE('%${searchQuery}%')`)
      .orWhere(`endStation.streetName LIKE('%${searchQuery}%')`)
      .orWhere(`endStation.city LIKE('%${searchQuery}%')`)
      .orWhere(`endStation.zipcode LIKE('%${searchQuery}%')`)
      .orWhere(`bike.matriculate LIKE('%${searchQuery}%')`)
      .orWhere(`user.email LIKE('%${searchQuery}%')`)
      .skip(param.offset)
      .take(param.limit)
      .getManyAndCount();
    for (const ride of result[0]) {
      Reflect.deleteProperty(ride.user, 'password');
    }
    return result;
  }

  async startRide(
    bike: Bike,
    startStation: Station,
    user: User
  ): Promise<Ride> {}

  async getCurrentRide(user: User): Promise<Ride> {}

  async endRide(ride: Ride, endStation: Station): Promise<Ride> {}
}
