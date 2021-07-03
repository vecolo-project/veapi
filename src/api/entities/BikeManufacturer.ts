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
import { BikeModel } from './BikeModel';

@Entity()
export class BikeManufacturer extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @OneToMany(() => BikeModel, (bikeModel) => bikeModel.bikeManufacturer)
  bikeModel: BikeModel[];
}

@Service()
@EntityRepository(BikeManufacturer)
export class BikeManufacturerRepository extends Repository<BikeManufacturer> {}
