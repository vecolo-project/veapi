import { Service } from 'typedi';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  EntityRepository,
  Repository,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Invoice } from './Invoice';
import { Plan } from './Plant';
import { User } from './User';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('increment')
  subscriptionId: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column()
  monthDuration: number;

  @Column()
  autoRenew: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Plan, (plan) => plan.planId)
  plan: Plan;

  @ManyToOne(() => User, (user) => user.userId)
  user: User;

  @OneToMany(() => Invoice, (invoice) => invoice.subscription)
  invoices: Invoice[];
}

@Service()
@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {}
