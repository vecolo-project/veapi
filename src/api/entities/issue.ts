import { Service } from 'typedi';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { IssueThread } from './issueThread';
import { User } from './User';

export enum IssueType {
  BIKE = 'BIKE',
  STATION = 'STATION',
}

export enum IssueStatus {
  DONE = 'DONE',
  IN_PROGRESS = 'IN PROGRESS',
  CREATED = 'CREATED',
}

@Entity()
export class Issue extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  attachedFiles: string;

  @Column({ type: 'enum', enum: ['BIKE', 'STATION'], default: 'BIKE' })
  type: IssueType;

  @Column({
    type: 'enum',
    enum: ['CREATED', 'DONE', 'IN PROGRESS'],
    default: 'CREATED',
  })
  status: IssueStatus;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @OneToMany(() => IssueThread, (issueThread) => issueThread.issue)
  issueThread: IssueThread[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Service()
@EntityRepository(Issue)
export class IssueRepository extends Repository<Issue> {}
