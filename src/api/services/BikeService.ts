import { Inject, Service } from 'typedi';
import { Bike, BikeRepository, BikeStatus } from '../entities/Bike';
import CRUD, { getAllParams } from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Like, MoreThan, ObjectLiteral } from 'typeorm';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { validate } from 'class-validator';
import _ from "lodash";

@Service()
export default class BikeService extends CRUD<Bike> {
  batteryPercentCapToBeReady = 30;

  constructor(
    @InjectRepository(Bike)
    protected bikeRepo: BikeRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(bikeRepo, logger);
  }

  async getAllByModel(id: number): Promise<Bike[] | null> {
    return this.bikeRepo.find({ where: { model: { id } } });
  }

  async getBikeReadyFromStation(id: number): Promise<Bike | null> {
    return this.bikeRepo.findOne({
      where: {
        status: BikeStatus.RECHARGING,
        station: { id },
        batteryPercent: MoreThan(this.batteryPercentCapToBeReady),
      },
    });
  }

  async getAllFromStation(id: number, param: getAllParams): Promise<Bike[]> {
    return this.repo.find({
      where: { station: { id } },
      relations: ['model', 'model.bikeManufacturer'],
      skip: param.offset,
      take: param.limit,
    });
  }

  async findWithStationAndModel(id: number): Promise<Bike> {
    return this.repo.findOne({
      where: { id },
      relations: ['model', 'model.bikeManufacturer', 'station'],
    });
  }

  async search(
    params: getAllParams,
    searchQuery?: any
  ): Promise<[Bike[], number]> {
    /*
    let bikes: Bike[];
    let count: number;
    if (searchQuery) {
      bikes = await this.repo.find({
        relations: ['model', 'model.bikeManufacturer'],
        where: [
          { matriculate: Like(`%${searchQuery}%`) },
          { batteryPercent: Like(`%${searchQuery}%`) },
          { status: Like(`%${searchQuery}%`) },
        ],
        take: params.limit,
        skip: params.offset,
      });
      count = await this.repo.count({
        where: [
          { matriculate: Like(`%${searchQuery}%`) },
          { batteryPercent: Like(`%${searchQuery}%`) },
          { status: Like(`%${searchQuery}%`) },
        ],
      });
    } else {
      bikes = await this.repo.find({
        relations: ['model', 'model.bikeManufacturer'],
        take: params.limit,
        skip: params.offset,
      });
      count = await this.repo.count();
    }
    return { bikes, count };
*/
    return this.bikeRepo
      .createQueryBuilder('bike')
      .leftJoinAndSelect('bike.model', 'model')
      .leftJoinAndSelect('model.bikeManufacturer', 'manufacturer')
      .where(`bike.matriculate LIKE ('%${searchQuery}%')`)
      .orWhere(`bike.batteryPercent LIKE ('%${searchQuery}%')`)
      .orWhere(`bike.status LIKE ('%${searchQuery}%')`)
      .orWhere(`model.name LIKE ('%${searchQuery}%')`)
      .orWhere(`manufacturer.name LIKE ('%${searchQuery}%')`)
      .skip(params.offset)
      .take(params.limit)
      .getManyAndCount();
  }

  async update(id: number, updatedFields: ObjectLiteral): Promise<Bike> {
    const entity = await this.repo.findOne(id, {
      relations: ['model', 'station'],
    });
    if (!entity) {
      throw new ErrorHandler(404, 'Not found');
    }
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] !== undefined && _.has(entity, key)) {
        entity[key] = updatedFields[key];
      }
    });
    const errors = await validate(entity, {
      validationError: { target: false },
    });
    if (errors.length > 0) throw errors;
    if (_.has(entity, 'updatedAt')) {
      entity['updatedAt'] = new Date();
    }
    return await this.repo.save(entity);
  }
}
