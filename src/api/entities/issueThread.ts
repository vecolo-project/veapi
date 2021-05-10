import { Service } from 'typedi';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { Issue } from './issue';
import { User } from './User';

@Entity()
export class IssueThread extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @ManyToOne(() => Issue, (issue) => issue.id)
  issue: Issue;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Service()
@EntityRepository(IssueThread)
export class IssueThreadRepository extends Repository<IssueThread> {}
