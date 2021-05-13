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
import { Bike } from './Bike';

@Entity()
export class Ride extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  duration: number;

  @ManyToOne(() => Station, (station) => station.id)
  start_station: Station;

  @ManyToOne(() => Station, (station) => station.id)
  end_station: Station;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Bike, (bike) => bike.id)
  bike: Bike;

  @Column()
  ride_length: number;

  @Column()
  invoice_amount: number;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}

@Service()
@EntityRepository(Ride)
export class StationStatusRepository extends Repository<Ride> {}
