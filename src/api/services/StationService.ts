import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Station, StationRepository } from '../entities/Station';
import jwt from 'jsonwebtoken';
import config from '../../config';

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

  generateToken(stationRecord: Station): string {
    this.logger.debug(`Signing JWT for stationId: ${stationRecord.id}`);
    return jwt.sign(
      {
        id: stationRecord.id,
      },
      config.jwtSecret
    );
  }
}
