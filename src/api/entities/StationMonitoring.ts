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

enum StationMonitoringStatus {
  ACTIVE = 'ACTIVE',
  MAINTAINING = 'MAINTAINING',
  OFF = 'OFF',
}
// demander a noé ce qu'il veut

@Entity()
export class StationMonitoring extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'MAINTAINING', 'OFF'],
    default: StationMonitoringStatus.OFF,
  })
  status: string;

  @Column({ type: 'double' })
  batteryPercent: number;

  @Column({ type: 'double' })
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
export class StationMonitoringRepository extends Repository<
  StationMonitoring
> {}
