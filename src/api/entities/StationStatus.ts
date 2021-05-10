import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from 'typedi';

@Entity()
export class StationStatus extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
}

@Service()
@EntityRepository(StationStatus)
export class StationStatusRepository extends Repository<StationStatus> {}
