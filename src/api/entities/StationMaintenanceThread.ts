import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  ManyToOne,
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

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Station, (stationBreakdown) => stationBreakdown.id)
  stationBreakdown: Station;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Service()
@EntityRepository(StationMaintenanceThread)
export class StationStatusRepository extends Repository<
  StationMaintenanceThread
> {}
