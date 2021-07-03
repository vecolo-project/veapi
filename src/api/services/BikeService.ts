import { Inject, Service } from 'typedi';
import { Bike, BikeRepository, BikeStatus } from '../entities/Bike';
import CRUD, { getAllParams } from './CRUD';
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
    return this.bikeRepo.find({ where: { BikeModel: { id } } });
  }

  async getBikeReadyFromStation(id: number): Promise<Bike | null> {
    return this.bikeRepo.findOne({
      where: {
        status: BikeStatus.RECHARGING,
        station: { id },
        batteryPercent: MoreThan(this.batteryPercentCapToBeReady),
      },
    });
  }

  async getAllFromStation(id: number, param: getAllParams): Promise<Bike[]> {
    return this.repo.find({
      where: { station: { id } },
      relations: ['model', 'model.bikeManufacturer'],
      skip: param.offset,
      take: param.limit,
    });
  }
}
