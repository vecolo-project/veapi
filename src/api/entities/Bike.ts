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
import { Station } from './Station';
import { BikeModel } from './BikeModel';
import { BikeStatus } from './BikeStatus';
import { Ride } from './Ride';
import { BikeMaintenanceThread } from './BikeMaintenanceThread';

@Entity()
export class Bike extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  matriculate: string;

  @ManyToOne(() => Station, (station) => station.id)
  station: Station;

  @Column()
  batteryPercent: number;

  @Column({ nullable: false, default: false })
  recharging: boolean;

  @ManyToOne(() => BikeModel, (bikeModel) => bikeModel.id)
  model: BikeModel;

  @ManyToOne(() => BikeStatus, (bikeStatus) => bikeStatus.id)
  status: BikeStatus;

  @OneToMany(() => Ride, (ride) => ride.bike)
  ride: Ride[];

  @OneToMany(
    () => BikeMaintenanceThread,
    (bikeMaintenanceThread) => bikeMaintenanceThread.bikeBreakdown
  )
  bikeMaintenanceThread: BikeMaintenanceThread[];

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}

@Service()
@EntityRepository(Bike)
export class StationStatusRepository extends Repository<Bike> {}
