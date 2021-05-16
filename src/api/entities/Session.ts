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
  expireDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}

@Service()
@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {}
