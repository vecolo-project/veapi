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
    (station_monitoring) => station_monitoring.id
  )
  station_monitoring: StationMonitoring[];

  @OneToMany(
    () => StationMaintenanceThread,
    (station_maintenance_thread) => station_maintenance_thread.station_breakdown
  )
  station_maintenance_thread: StationMaintenanceThread[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Service()
@EntityRepository(Station)
export class StationStatusRepository extends Repository<Station> {}
