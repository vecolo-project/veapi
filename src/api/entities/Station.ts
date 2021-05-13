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
  battery_capacity: number;

  @Column()
  bike_capacity: number;

  @Column()
  street_number: number;

  @Column()
  street_name: string;

  @Column()
  city: string;

  @Column()
  zipcode: string;

  @Column()
  coordinate_x: number;

  @Column()
  coordinate_y: number;

  @OneToMany(
    () => StationMonitoring,
    (station_monitoring) => station_monitoring.station
  )
  station_monitoring: StationMonitoring[];

  @OneToMany(() => Ride, (ride) => ride.start_station)
  start_ride: Ride[];

  @OneToMany(() => Ride, (ride) => ride.end_station)
  end_ride: Ride[];

  @OneToMany(
    () => StationMaintenanceThread,
    (station_maintenance_thread) => station_maintenance_thread.station_breakdown
  )
  station_maintenance_thread: StationMaintenanceThread[];

  @OneToMany(() => Bike, (bike) => bike.station)
  bike: Bike[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Service()
@EntityRepository(Station)
export class StationStatusRepository extends Repository<Station> {}
