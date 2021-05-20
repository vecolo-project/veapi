import { Inject, Service } from 'typedi';
import { Bike, BikeRepository, BikeStatus } from '../entities/Bike';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { MoreThan } from 'typeorm';

@Service()
export default class BikeService extends CRUD<Bike> {
  batteryPercentCapToBeReady = 30;
  constructor(
    @InjectRepository(Bike)
    protected bikeRepo: BikeRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(bikeRepo, logger);
  }

  async getAllByModel(id: number): Promise<Bike[] | null> {
    return this.bikeRepo.find({ where: { BikeModel: id } });
  }

  async getBikeReadyFromStation(id: number): Promise<Bike | null> {
    return this.bikeRepo.findOne({
      where: {
        status: BikeStatus.RECHARGING,
        station: id,
        batteryPercent: MoreThan(this.batteryPercentCapToBeReady),
      },
    });
  }
}
