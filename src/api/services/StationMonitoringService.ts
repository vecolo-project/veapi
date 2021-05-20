import CRUD from './CRUD';
import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import {
  StationMonitoring,
  StationMonitoringRepository,
} from '../entities/StationMonitoring';

@Service()
export default class StationMonitoringService extends CRUD<StationMonitoring> {
  constructor(
    @InjectRepository(StationMonitoring)
    protected stationMonitoringRepo: StationMonitoringRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(stationMonitoringRepo, logger);
  }
}
