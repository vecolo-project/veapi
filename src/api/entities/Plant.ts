import { Service } from 'typedi';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  EntityRepository,
  Repository,
  OneToMany,
} from 'typeorm';
import { Subscription } from './Subscription';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  costPerMinute: number;

  @Column()
  isUnlimited: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}

@Service()
@EntityRepository(Plan)
export class PlanRepository extends Repository<Plan> {}
