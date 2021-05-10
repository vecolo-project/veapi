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




  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Service()
@EntityRepository(Station)
export class StationStatusRepository extends Repository<Station> {}
