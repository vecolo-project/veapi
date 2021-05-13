import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  EntityRepository,
  Repository,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Service } from 'typedi';
import { Bike } from './Bike';
import { BikeManufacturer } from './BikeManufacturer';

@Entity()
export class BikeModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => BikeModel, (bikeManufacturer) => bikeManufacturer.id)
  bikeManufacturer: BikeModel;

  @Column()
  batteryCapacity: number;

  @Column()
  weight: number;

  @Column()
  maxPower: number;

  @Column()
  maxSpeed: number;

  @Column()
  maxDistance: number;

  @Column({ type: 'text' })
  description: string;

  @Column()
  image: string;

  @Column()
  icon: string;

  @OneToMany(() => Bike, (bike) => bike.station)
  bikes: Bike[];

  @ManyToOne(() => BikeManufacturer, (bikeManufacturer) => bikeManufacturer.id)
  manufacturer: BikeManufacturer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Service()
@EntityRepository(BikeModel)
export class UserRepository extends Repository<BikeModel> {}
