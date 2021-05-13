import { Inject, Service } from 'typedi';
import CRUD from './CRUD';
import { Article, ArticleRepository } from '../entities/Article';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';

@Service()
export default class ArticleService extends CRUD<Article> {
  constructor(
    @InjectRepository(Article) protected articleRepo: ArticleRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(articleRepo, logger);
  }

  async searchByName(tags: string): Promise<Article[] | null> {
    tags = '%' + tags.replace(' ', '%') + '%';
    return this.articleRepo
      .createQueryBuilder('Article')
      .where('Article.name LIKE :tags', { tags: tags })
      .getMany();
  }
}
