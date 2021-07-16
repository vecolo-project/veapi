import { Container, Inject, Service } from 'typedi';
import CRUD, { getAllParams } from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Subscription, SubscriptionRepository } from '../entities/Subscription';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { validate } from 'class-validator';
import _ from 'lodash';
import { addMonths } from 'date-fns';
import InvoiceService from './InvoiceService';
import { User } from '../entities/User';

@Service()
export default class SubscriptionService extends CRUD<Subscription> {
  invoiceService: InvoiceService;

  constructor(
    @InjectRepository(Subscription)
    protected subscriptionRepo: SubscriptionRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(subscriptionRepo, logger);
    this.invoiceService = Container.get(InvoiceService);
  }

  async getAllFromPlan(
    id: number,
    params: getAllParams
  ): Promise<Subscription[]> {
    return this.repo.find({
      where: {
        plan: id,
      },
      skip: params.offset,
      take: params.limit,
    });
  }

  async getAllFromUser(
    id: number,
    params: getAllParams
  ): Promise<[Subscription[], number]> {
    return this.repo.findAndCount({
      where: {
        user: { id },
      },
      relations: ['plan'],
      skip: params.offset,
      take: params.limit,
    });
  }

  async findLastFromUser(userId: number): Promise<Subscription> {
    const subscription = await this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
    if (
      addMonths(new Date(subscription.startDate), subscription.monthDuration) >=
      new Date()
    ) {
      return subscription;
    }
    return undefined;
  }

  async getAllWithRelation(params: getAllParams): Promise<Subscription[]> {
    const result = await this.repo.find({
      relations: ['plan', 'user'],
      skip: params.offset,
      take: params.limit,
    });
    for (const sub of result) {
      Reflect.deleteProperty(sub.user, 'password');
    }
    return result;
  }

  async getOneWithRelation(id: number): Promise<Subscription> {
    const result = await this.repo.findOne(id, {
      relations: ['plan', 'user'],
    });
    Reflect.deleteProperty(result.user, 'password');
    return result;
  }

  async update(id: number, updatedFields: Subscription): Promise<Subscription> {
    const entity = await this.repo.findOne(id, { relations: ['plan'] });
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
    if (errors.length > 0) {
      throw errors;
    }
    if (_.has(entity, 'updatedAt')) {
      entity['updatedAt'] = new Date();
    }
    return await this.repo.save(entity);
  }

  async createS(subscription: Subscription, user: User): Promise<Subscription> {
    const invoice: any = {
      billingDate: new Date(),
      amount: subscription.plan?.price,
      user: user,
      subscription: subscription,
    };
    await this.invoiceService.create(invoice);
    return await this.create(subscription);
  }
}
