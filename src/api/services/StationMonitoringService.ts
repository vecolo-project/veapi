import CRUD from './CRUD';
import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import {
  StationMonitoring,
  StationMonitoringCreationProps,
  StationMonitoringRepository,
  StationMonitoringStatus,
} from '../entities/StationMonitoring';
import { Between } from 'typeorm';

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

  async getLastStationMonitoring(
    stationId: number
  ): Promise<StationMonitoring | undefined> {
    return await this.stationMonitoringRepo.findOne({
      where: {
        station: {
          id: stationId,
        },
      },
      order: { id: 'DESC' },
    });
  }

  async addMetric(
    stationId: number,
    stationMonitoringProps: StationMonitoringCreationProps
  ): Promise<StationMonitoring | undefined> {
    const previousStationMonitoring: StationMonitoring | undefined =
      await this.getLastStationMonitoring(stationId);

    if (
      previousStationMonitoring &&
      previousStationMonitoring.status == StationMonitoringStatus.MAINTAINING
    ) {
      stationMonitoringProps.isActive = false;
      stationMonitoringProps.status = StationMonitoringStatus.MAINTAINING;
    }

    return await this.create(
      StationMonitoring.create({
        ...stationMonitoringProps,
      })
    );
  }

  async findLast(stationId: number): Promise<StationMonitoring | undefined> {
    return this.stationMonitoringRepo.findOne({
      where: { station: { id: stationId } },
      order: { id: 'DESC' },
    });
  }

  async getMonitoringFromPeriod(
    stationId: number,
    dateStart: Date,
    dateEnd: Date
  ): Promise<StationMonitoring[]> {
    return await this.repo.find({
      where: {
        createdAt: Between(dateStart, dateEnd),
        station: { id: stationId },
      },
      order: {
        createdAt: 'ASC',
      },
    });

    /*return await this.repo
      .createQueryBuilder('stationMonitoring')
      .where(
        `stationMonitoring.createdAt BETWEEN '${dateStart.toISOString()}' AND '${dateEnd.toISOString()}'`
      )
      .andWhere(`stationMonitoring.stationId = ${stationId}`)
      .andWhere('stationMonitoring.id mod 500 = 0')
      .orderBy('stationMonitoring.createdAt', 'ASC')
      .getMany();*/
  }
}
