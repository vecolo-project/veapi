import { Inject, Service } from 'typedi';
import { BikeModel, BikeModelRepository } from '../entities/BikeModel';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';

@Service()
export default class BikeModelService extends CRUD<BikeModel> {
  constructor(
    @InjectRepository(BikeModel)
    protected bikeModelRepo: BikeModelRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(bikeModelRepo, logger);
  }
}
