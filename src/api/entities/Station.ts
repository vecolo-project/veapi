import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from 'typedi';
import { StationMonitoring } from './StationMonitoring';
import { StationMaintenanceThread } from './StationMaintenanceThread';
import { Bike } from './Bike';
import { Ride } from './Ride';

@Entity()
export class Station extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  batteryCapacity: number;

  @Column()
  bikeCapacity: number;

  @Column()
  streetNumber: number;

  @Column()
  streetName: string;

  @Column()
  city: string;

  @Column()
  zipcode: string;

  @Column()
  coordinateX: number;

  @Column()
  coordinateY: number;

  @OneToMany(
    () => StationMonitoring,
    (stationMonitoring) => stationMonitoring.station
  )
  stationMonitoring: StationMonitoring[];

  @OneToMany(() => Ride, (ride) => ride.startStation)
  startRide: Ride[];

  @OneToMany(() => Ride, (ride) => ride.endStation)
  endRide: Ride[];

  @OneToMany(
    () => StationMaintenanceThread,
    (stationMaintenanceThread) => stationMaintenanceThread.stationBreakdown
  )
  stationMaintenanceThread: StationMaintenanceThread[];

  @OneToMany(() => Bike, (bike) => bike.station)
  bike: Bike[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Service()
@EntityRepository(Station)
export class StationStatusRepository extends Repository<Station> {}
