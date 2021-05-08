import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  EntityRepository,
  Repository,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Service } from 'typedi';

export type Role = 'user' | 'staff' | 'admin';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column({ unique: true })
  @IsEmail(
    {},
    {
      message: 'Invalid email address',
    }
  )
  email?: string;

  @Column()
  password?: string;

  @Column()
  role?: Role = 'user';

  public hasAccessTo?(role: Role): boolean {
    const roles = ['user', 'staff', 'admin'];
    return roles.indexOf(this.role) >= roles.indexOf(role);
  }
}

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {}

export interface UserResponse {
  user: User;
  token: string;
}

export interface userCreationProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
