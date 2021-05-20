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
import { IssueThread } from './IssueThread';
import { Issue } from './Issue';
import { Ride } from './Ride';
import { BikeMaintenanceThread } from './BikeMaintenanceThread';
import { StationMaintenanceThread } from './StationMaintenanceThread';

export enum Role {
  CLIENT = 'CLIENT',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  STATION = 'STATION',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ nullable: false, default: true })
  isActive: boolean;

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

  @Column({ nullable: false, default: false })
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

  @OneToMany(() => IssueThread, (issueThread) => issueThread.author)
  threads: IssueThread[];

  @OneToMany(() => Issue, (issue) => issue.creator)
  issue: Issue[];

  @OneToMany(() => Ride, (ride) => ride.user)
  rides: Ride[];

  @OneToMany(
    () => BikeMaintenanceThread,
    (bikeMaintenanceThread) => bikeMaintenanceThread.user
  )
  bikeMaintenanceThreads: BikeMaintenanceThread[];

  @OneToMany(
    () => StationMaintenanceThread,
    (stationMaintenanceThread) => stationMaintenanceThread.user
  )
  stationMaintenanceThreads: StationMaintenanceThread[];

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'CLIENT', 'STAFF', 'STATION'],
    default: Role.CLIENT,
  })
  role: Role;

  public hasAccessTo(role: Role): boolean {
    if (this.role === Role.ADMIN) {
      return true;
    }
    if (role === Role.CLIENT && this.role === Role.STAFF) {
      return true;
    }
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

export interface UserCreationProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  pseudo: string;
}
