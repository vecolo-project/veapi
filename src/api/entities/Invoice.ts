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
  id: number;

  @Column({ type: 'date' })
  billingDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Subscription, (subscription) => subscription.id)
  subscription: Subscription;
}

@Service()
@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {}
