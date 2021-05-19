import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Plan, PlanRepository } from '../entities/Plan';

@Service()
export default class PlanService extends CRUD<Plan> {
  constructor(
    @InjectRepository(Plan)
    protected planRepo: PlanRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(planRepo, logger);
  }
}
