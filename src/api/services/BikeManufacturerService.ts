import {
  BikeManufacturer,
  BikeManufacturerRepository,
} from '../entities/BikeManufacturer';
import CRUD from './CRUD';
import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';

@Service()
export default class BikeManufacturerService extends CRUD<BikeManufacturer> {
  constructor(
    @InjectRepository(BikeManufacturer)
    protected bikeManufacturerRepo: BikeManufacturerRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(bikeManufacturerRepo, logger);
  }
}
