import { Inject, Service } from 'typedi';
import {
  BikeMaintenanceThread,
  BikeMaintenanceThreadRepository,
} from '../entities/BikeMaintenanceThread';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';

@Service()
export default class BikeMaintenanceThreadService extends CRUD<BikeMaintenanceThread> {
  constructor(
    @InjectRepository(BikeMaintenanceThread)
    protected bikeMaintenanceThreadRepo: BikeMaintenanceThreadRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(bikeMaintenanceThreadRepo, logger);
  }

  async getAllFromBike(id: number): Promise<BikeMaintenanceThread[] | null> {
    return this.bikeMaintenanceThreadRepo.find({
      where: {
        bikeBreakdown: id,
      },
    });
  }

  async getAllFromUser(id: number): Promise<BikeMaintenanceThread[]> {
    return this.bikeMaintenanceThreadRepo.find({ where: { user: id } });
  }
}
