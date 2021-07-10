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
import { Ride } from './Ride';
import { BikeMaintenanceThread } from './BikeMaintenanceThread';

export enum BikeStatus {
  OFF = 'OFF',
  MAINTAINING = 'MAINTAINING',
  IN_RIDE = 'IN_RIDE',
  RECHARGING = 'RECHARGING',
}

@Entity()
export class Bike extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  matriculate: string;

  @ManyToOne(() => Station, (station) => station.id)
  station: Station;

  @Column({ type: 'double' })
  batteryPercent: number;

  @Column({ nullable: false, default: false })
  recharging: boolean;

  @ManyToOne(() => BikeModel, (bikeModel) => bikeModel.id)
  model: BikeModel;

  @Column({
    type: 'enum',
    enum: ['OFF', 'MAINTAINING', 'IN_RIDE', 'RECHARGING'],
    default: BikeStatus.OFF,
  })
  status: BikeStatus;

  @OneToMany(() => Ride, (ride) => ride.bike)
  ride: Ride[];

  @OneToMany(
    () => BikeMaintenanceThread,
    (bikeMaintenanceThread) => bikeMaintenanceThread.bikeBreakdown
  )
  bikeMaintenanceThread: BikeMaintenanceThread[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Service()
@EntityRepository(Bike)
export class BikeRepository extends Repository<Bike> {}
