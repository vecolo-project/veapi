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
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column()
  monthDuration: number;

  @Column({ default: false })
  autoRenew: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Plan, (plan) => plan.id)
  plan: Plan;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => Invoice, (invoice) => invoice.subscription)
  invoices: Invoice[];
}

@Service()
@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {}
