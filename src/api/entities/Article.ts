import { Service } from 'typedi';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  EntityRepository,
  Repository,
  Entity,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  articleId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  cover: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userId)
  author: User;
}

@Service()
@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {}
