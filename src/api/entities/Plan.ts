import { Service } from 'typedi';
import {
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
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

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  freeMinutes: number;

  @Column({ nullable: false, default: false })
  isActive: boolean;

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
