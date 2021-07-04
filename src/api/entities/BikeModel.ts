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
import { Bike } from './Bike';
import { BikeManufacturer } from './BikeManufacturer';

@Entity()
export class BikeModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'double' })
  batteryCapacity: number;

  @Column({ type: 'double' })
  weight: number;

  @Column({ type: 'double' })
  maxPower: number;

  @Column({ type: 'double' })
  maxSpeed: number;

  @Column({ type: 'double' })
  maxDistance: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => Bike, (bike) => bike.station)
  bikes: Bike[];

  @ManyToOne(() => BikeManufacturer, (bikeManufacturer) => bikeManufacturer.id)
  bikeManufacturer: BikeManufacturer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Service()
@EntityRepository(BikeModel)
export class BikeModelRepository extends Repository<BikeModel> {}
