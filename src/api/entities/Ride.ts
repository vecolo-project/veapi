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

  /**
   * substration of 2 timestamp
   */
  @Column()
  duration: number;

  @ManyToOne(() => Station, (station) => station.id)
  startStation: Station;

  @ManyToOne(() => Station, (station) => station.id)
  endStation: Station;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Bike, (bike) => bike.id)
  bike: Bike;

  @Column()
  rideLength: number;

  @Column()
  invoiceAmount: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Service()
@EntityRepository(Ride)
export class StationStatusRepository extends Repository<Ride> {}
