import { Inject, Service } from 'typedi';
import CRUD, { getAllParams } from "./CRUD";
import { Article, ArticleRepository } from '../entities/Article';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { Like } from 'typeorm';

@Service()
export default class ArticleService extends CRUD<Article> {
  constructor(
    @InjectRepository(Article) protected articleRepo: ArticleRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(articleRepo, logger);
  }

  async searchByName(
    tags: string,
    param: getAllParams
  ): Promise<Article[] | null> {
    tags = '%' + tags.replace(' ', '%') + '%';
    return await this.articleRepo.find({
      where: {
        title: Like(tags),
      },
    });
  }
}
