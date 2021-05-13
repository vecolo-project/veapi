import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  ManyToOne,
  OneToMany,
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

  @Column()
  content: string;

  @ManyToOne(() => Bike, (bike) => bike.id)
  bike_breakdown: Bike;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}

@Service()
@EntityRepository(BikeMaintenanceThread)
export class StationStatusRepository extends Repository<
  BikeMaintenanceThread
> {}
