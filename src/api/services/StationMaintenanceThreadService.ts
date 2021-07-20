import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import {
  StationMaintenanceThread,
  StationMaintenanceThreadRepository,
} from '../entities/StationMaintenanceThread';

@Service()
export default class StationMaintenanceThreadService extends CRUD<StationMaintenanceThread> {
  constructor(
    @InjectRepository(StationMaintenanceThread)
    protected stationMaintenanceThreadRepo: StationMaintenanceThreadRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(stationMaintenanceThreadRepo, logger);
  }

  async getAllFromUser(id: number): Promise<StationMaintenanceThread[]> {
    return this.stationMaintenanceThreadRepo.find({ where: { user: id } });
  }

  async getAllFromStation(id: number): Promise<StationMaintenanceThread[]> {
    return this.stationMaintenanceThreadRepo.find({
      where: { stationBreakdown: id },
    });
  }
}
