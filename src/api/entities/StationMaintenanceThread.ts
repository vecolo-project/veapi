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
import { User } from './User';

@Entity()
export class StationMaintenanceThread extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Station, (station_breakdown) => station_breakdown.id)
  station_breakdown: Station;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}

@Service()
@EntityRepository(StationMaintenanceThread)
export class StationStatusRepository extends Repository<
  StationMaintenanceThread
> {}
