import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Subscription, SubscriptionRepository } from '../entities/Subscription';

@Service()
export default class SubscriptionService extends CRUD<Subscription> {
  constructor(
    @InjectRepository(Subscription)
    protected subscriptionRepo: SubscriptionRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(subscriptionRepo, logger);
  }
}
