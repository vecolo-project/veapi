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
  id: number;

  @Column()
  value: string;

  @Column()
  expire_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}

@Service()
@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {}
