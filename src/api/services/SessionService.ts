import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Session, SessionRepository } from '../entities/Session';

@Service()
export default class SessionService extends CRUD<Session> {
  constructor(
    @InjectRepository(Session)
    protected sessionRepo: SessionRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(sessionRepo, logger);
  }
}
