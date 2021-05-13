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

enum stationMonitoringStatus {}
// demander a noé ce qu'il veut

@Entity()
export class StationMonitoring extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ['En service', 'En réparation', 'Inactive'],
    default: 'En service',
  })
  status: string;

  @Column()
  batteryPercent: number;

  @Column()
  chargingPower: number;

  @Column()
  usedBikeSlot: number;

  @ManyToOne(() => Station, (station) => station.id)
  station: Station;

  @CreateDateColumn()
  createdAt: Date;
}

@Service()
@EntityRepository(StationMonitoring)
export class StationStatusRepository extends Repository<StationMonitoring> {}
