import { Inject, Service } from 'typedi';
import CRUD, { getAllParams } from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Ride, RideRepository } from '../entities/Ride';

@Service()
export default class RideService extends CRUD<Ride> {
  constructor(
    @InjectRepository(Ride)
    protected rideRepo: RideRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(rideRepo, logger);
  }

  async getAllRideFromUser(
    id: number,
    param: getAllParams
  ): Promise<Ride[] | null> {
    return this.rideRepo.find({
      where: { user: id },
      skip: param.offset,
      take: param.limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getAllRideFromBike(id: number): Promise<Ride[] | null> {
    return this.rideRepo.find({
      where: { user: id },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllRideFromStation(
    id: number,
    param: getAllParams
  ): Promise<Ride[] | null> {
    return this.rideRepo.find({
      where: [{ startStation: id }, { endStation: id }],
      skip: param.offset,
      take: param.limit,
    });
  }
}
