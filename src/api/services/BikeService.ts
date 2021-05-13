import { Inject, Service } from 'typedi';
import { Bike, BikeRepository } from '../entities/Bike';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';

@Service()
export default class BikeService extends CRUD<Bike> {
  constructor(
    @InjectRepository(Bike)
    protected bikeRepo: BikeRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(bikeRepo, logger);
  }
}
