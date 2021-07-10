import { Container, Inject, Service } from 'typedi';
import CRUD, { getAllParams } from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Station, StationRepository } from '../entities/Station';
import jwt from 'jsonwebtoken';
import config from '../../config';
import StationMonitoringService from './StationMonitoringService';
import { StationMonitoring } from '../entities/StationMonitoring';
import { Like } from 'typeorm';

@Service()
export default class StationService extends CRUD<Station> {
  private stationMonitoringService: StationMonitoringService;

  constructor(
    @InjectRepository(Station)
    protected stationRepo: StationRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(stationRepo, logger);
    this.stationMonitoringService = Container.get(StationMonitoringService);
  }

  generateToken({ id }: Station): string {
    this.logger.debug(`Signing JWT for stationId: ${id}`);
    return jwt.sign({ id }, config.jwtSecret);
  }

  async findAll(param: getAllParams): Promise<Station[]> {
    const stations: Station[] = await this.find(param);
    for (const i in stations) {
      const monitoring: StationMonitoring = await this.stationMonitoringService.findLast(
        stations[i].id
      );
      if (monitoring) {
        stations[i].stationMonitoring = [monitoring];
      } else {
        stations[i].stationMonitoring = [];
      }
    }
    return stations;
  }

  async search(
    params: getAllParams,
    searchQuery?: any
  ): Promise<{ stations: Station[]; count: number }> {
    let stations: Station[];
    let count: number;
    if (searchQuery) {
      [stations, count] = await this.repo.findAndCount({
        where: [
          { id: Like(`%${searchQuery}%`) },
          { streetNumber: Like(`%${searchQuery}%`) },
          { streetName: Like(`%${searchQuery}%`) },
          { city: Like(`%${searchQuery}%`) },
          { zipcode: Like(`%${searchQuery}%`) },
        ],
        take: params.limit,
        skip: params.offset,
      });
    } else {
      [stations, count] = await this.repo.findAndCount({
        take: params.limit,
        skip: params.offset,
      });
    }
    for (const i in stations) {
      const monitoring: StationMonitoring = await this.stationMonitoringService.findLast(
        stations[i].id
      );
      if (monitoring) {
        stations[i].stationMonitoring = [monitoring];
      } else {
        stations[i].stationMonitoring = [];
      }
    }

    return { stations, count };
  }

  async getOne(id: number): Promise<Station | undefined> {
    const station: Station = await this.findOne(id);
    if (station) {
      const monitoring: StationMonitoring = await this.stationMonitoringService.findLast(
        station.id
      );
      if (monitoring) {
        station.stationMonitoring = [monitoring];
      } else {
        station.stationMonitoring = [];
      }
    }
    return station;
  }
}
