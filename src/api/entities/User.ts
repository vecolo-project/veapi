import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  EntityRepository,
  Repository,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Service } from 'typedi';
import { Session } from './Session';
import { Article } from './Article';
import { Invoice } from './Invoice';
import { Subscription } from './Subscription';

export enum Role {
  CLIENT = 'CLIENT',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ unique: true })
  @IsEmail(
    {},
    {
      message: 'Invalid email address',
    }
  )
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  pseudo: string;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column()
  newsletter: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'CLIENT', 'STAFF'],
    default: Role.CLIENT,
  })
  role: Role;

  public hasAccessTo(role: Role): boolean {
    return this.role === role;
  }
}

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {}

export interface UserResponse {
  user: User;
  token: string;
}

export interface userCreationProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
