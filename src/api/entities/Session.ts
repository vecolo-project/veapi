import { Service } from 'typedi';
import {
  Entity,
  Column,
  ManyToOne,
  EntityRepository,
  Repository,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  sessionId: number;

  @Column()
  value: string;

  @Column()
  expire_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userId)
  user: User;
}

@Service()
@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {}
