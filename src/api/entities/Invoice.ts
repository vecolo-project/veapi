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
} from 'typeorm';
import { Subscription } from './Subscription';
import { User } from './User';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('increment')
  invoiceId: number;

  @Column({ type: 'date' })
  billingDate: Date;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userId)
  user: User;

  @ManyToOne(() => Subscription, (subscription) => subscription.subscriptionId)
  subscription: Subscription;
}

@Service()
@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {}
