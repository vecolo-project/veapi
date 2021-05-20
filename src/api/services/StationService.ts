import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Station, StationRepository } from '../entities/Station';

@Service()
export default class StationService extends CRUD<Station> {
  constructor(
    @InjectRepository(Station)
    protected stationRepo: StationRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(stationRepo, logger);
  }
}
