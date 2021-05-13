import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from 'typedi';
import { Bike } from './Bike';
import { User } from './User';

@Entity()
export class BikeMaintenanceThread extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Bike, (bike) => bike.id)
  bikeBreakdown: Bike;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Service()
@EntityRepository(BikeMaintenanceThread)
export class StationStatusRepository extends Repository<
  BikeMaintenanceThread
> {}
