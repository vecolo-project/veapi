import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
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

  async getAllRideFromUser(id: number): Promise<Ride[]> {
    return this.rideRepo.find({
      where: { user: id },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllRideFromBike(id: number): Promise<Ride[]> {
    return this.rideRepo.find({
      where: { user: id },
      order: { createdAt: 'DESC' },
    });
  }
}
