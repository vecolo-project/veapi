import { Service } from 'typedi';
import { ObjectLiteral, Repository } from 'typeorm';
import { Logger } from 'winston';
import { validate } from 'class-validator';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import _ from 'lodash';

@Service()
export default class CRUD<Entity> {
  protected repo: Repository<Entity>;
  protected logger: Logger;

  constructor(repo: Repository<Entity>, logger: Logger) {
    this.repo = repo;
    this.logger = logger;
  }

  getRepo(): Repository<Entity> {
    return this.repo;
  }

  protected async fillObjectIdField(
    entity: Entity,
    fieldName: string,
    fieldEntityService: CRUD<any>
  ): Promise<void> {
    const entityName = entity.constructor.name;
    if (!entity) throw new ErrorHandler(500, `${entityName} not found`);
    if (!(fieldName in entity))
      throw new ErrorHandler(
        500,
        `${fieldName} does not exist in ${entityName}`
      );
    entity[fieldName] = await fieldEntityService.findOne(entity[fieldName]);
    if (!entity[fieldName]) {
      throw new ErrorHandler(500, `Invalid ${fieldName}`);
    }
  }

  async create(entity: Entity, identifier?: string): Promise<Entity> {
    const errors = await validate(entity, {
      validationError: { target: false },
    });
    const foundEntity =
      identifier &&
      (await this.repo.findOne({
        [identifier]: entity[identifier],
      }));
    if (foundEntity)
      throw new ErrorHandler(
        400,
        `The ${entity.constructor.name} already exists`
      );

    if (errors.length > 0) throw errors;
    return await this.repo.save(entity);
  }

  async find(param: getAllParams): Promise<Entity[]> {
    const option = {};
    option['take'] = param.limit;
    option['skip'] = param.offset;
    if (param.relations) {
      option['relations'] = param.relations;
    }
    const entities = await this.repo.find(option);
    if (entities) {
      return entities;
    }
    throw new ErrorHandler(404, 'Not found');
  }

  async findOne(id: number): Promise<Entity | undefined> {
    const entity = await this.repo.findOne(id);
    if (entity) {
      return entity;
    }
    throw new ErrorHandler(404, 'Not found');
  }

  async update(id: number, updatedFields: ObjectLiteral): Promise<Entity> {
    const entity = await this.repo.findOne(id);
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
      entity['updatedAt'] = new Date().toISOString();
    }
    return await this.repo.save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

export interface getAllParams {
  offset?: number;
  limit?: number;
  relations?: string[];
}
