import {
  BaseEntity,
  Column,
  Entity,
  EntityRepository,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { Service } from 'typedi';
import { Bike } from './Bike';

@Entity()
export class BikeStatus extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  available: boolean;

  @Column()
  name: string;

  @OneToMany(() => Bike, (bike) => bike.status)
  bike: Bike[];
}

@Service()
@EntityRepository(BikeStatus)
export class StationStatusRepository extends Repository<BikeStatus> {}
