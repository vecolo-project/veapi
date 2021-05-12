import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { Service } from 'typedi';
import { Station } from './Station';

@Entity()
export class StationMonitoring extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: ['En service', 'En réparation', 'Inactive'],
    default: 'En service',
  })
  status: string;

  @Column()
  battery_percent: number;

  @Column()
  charging_power: number;

  @Column()
  used_bike_slot: number;

  @ManyToOne(() => Station, (station) => station.id)
  station: Station;

  @CreateDateColumn()
  created_at: Date;
}

@Service()
@EntityRepository(StationMonitoring)
export class StationStatusRepository extends Repository<StationMonitoring> {}
