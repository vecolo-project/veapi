import { Inject, Service } from 'typedi';
import { BikeModel } from '../entities/BikeModel';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Issue, IssueRepository } from '../entities/Issue';

@Service()
export default class IssueService extends CRUD<Issue> {
  constructor(
    @InjectRepository(Issue)
    protected issueRepo: IssueRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(issueRepo, logger);
  }

  async getAllFromCreator(id: number): Promise<Issue[]> {
    return this.issueRepo.find({ where: { creator: id } });
  }
}
