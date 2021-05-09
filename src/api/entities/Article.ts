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
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  cover: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  author: User;
}

@Service()
@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {}
