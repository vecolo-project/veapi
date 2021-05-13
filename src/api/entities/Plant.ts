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

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  costPerMinute: number;

  @Column({ nullable: false, default: false })
  isUnlimited: boolean;

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
