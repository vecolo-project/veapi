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
} from 'typeorm';
import { Service } from 'typedi';

@Entity()
export class BikeModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => BikeModel, (bikeManufacturer) => bikeManufacturer.id)
  bikeManufacturer: BikeModel;

  @Column()
  battery_capacity: number;

  @Column()
  weight: number;

  @Column()
  max_power: number;

  @Column()
  max_speed: number;

  @Column()
  max_distance: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  icon: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Service()
@EntityRepository(BikeModel)
export class UserRepository extends Repository<BikeModel> {}
