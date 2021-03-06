import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { Container, Inject, Service } from 'typedi';
import {
  User,
  UserCreationProps,
  UserRepository,
  UserResponse,
} from '../entities/User';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { validate } from 'class-validator';
import CRUD, { getAllParams } from './CRUD';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { Like } from 'typeorm';
import SubscriptionService from './SubscriptionService';
import { Subscription } from '../entities/Subscription';
import { randomBytes } from 'crypto';

@Service()
export default class UserService extends CRUD<User> {
  private subscriptionService: SubscriptionService;
  constructor(
    @InjectRepository(User)
    protected userRepo: UserRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(userRepo, logger);
    this.subscriptionService = Container.get(SubscriptionService);
  }

  getRepo(): UserRepository {
    return this.userRepo;
  }

  async register(userInput: UserCreationProps): Promise<UserResponse> {
    this.logger.debug('Registering user...');
    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const newUser = User.create({
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      email: userInput.email,
      password: hashedPassword,
      birthDate: userInput.birthDate,
      pseudo: userInput.pseudo,
    });
    const errors = await validate(newUser, {
      validationError: { target: false },
    });
    if (errors.length > 0) {
      throw errors;
    }

    const foundUser = await this.userRepo.findOne({ email: newUser.email });
    if (foundUser) {
      throw new ErrorHandler(400, 'The email address already exists');
    }

    const userRecord: User = await this.userRepo.save(newUser);
    if (!userRecord) {
      throw new ErrorHandler(500, 'User cannot be created');
    }

    const token = this.generateToken(userRecord);
    const user = userRecord;
    Reflect.deleteProperty(user, 'password');
    return { user, token };
  }

  async login(email: string, password: string): Promise<UserResponse> {
    this.logger.debug('Authenticating user...');
    const userRecord = await this.userRepo.findOne({ email });
    if (!userRecord) {
      throw new ErrorHandler(401, 'Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, userRecord.password);

    if (validPassword) {
      const token = this.generateToken(userRecord);
      const user = userRecord;

      const subscription: Subscription =
        await this.subscriptionService.findLastFromUser(user.id);
      if (subscription) {
        user.subscriptions = [subscription];
      } else {
        user.subscriptions = [];
      }

      Reflect.deleteProperty(user, 'password');
      return { user, token };
    }
    throw new ErrorHandler(401, 'Invalid email or password');
  }

  generateToken(userRecord: User): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 7);
    this.logger.debug(`Signing JWT for userId: ${userRecord.id}`);
    return jwt.sign(
      {
        id: userRecord.id,
        email: userRecord.email,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }

  async search(
    params: getAllParams,
    searchQuery?: any
  ): Promise<{ users: User[]; count: number }> {
    let users: User[];
    let count: number;
    if (searchQuery) {
      const whereOption = [
        { firstName: Like(`%${searchQuery}%`) },
        { lastName: Like(`%${searchQuery}%`) },
        { email: Like(`%${searchQuery}%`) },
        { role: Like(`%${searchQuery}%`) },
      ];
      users = await this.repo.find({
        where: whereOption,
        take: params.limit,
        skip: params.offset,
      });
      count = await this.repo.count({
        where: whereOption,
      });
    } else {
      users = await this.repo.find({
        take: params.limit,
        skip: params.offset,
      });
      count = await this.repo.count();
    }
    for (const user of users) {
      Reflect.deleteProperty(user, 'password');
    }
    return { users, count };
  }

  async newsletterUsers(): Promise<User[]> {
    return await this.repo.find({
      where: {
        newsletter: true,
      },
    });
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.repo.findOne(id);
    if (user) {
      Reflect.deleteProperty(user, 'password');
    }
    const subscription: Subscription =
      await this.subscriptionService.findLastFromUser(id);
    if (subscription) {
      user.subscriptions = [subscription];
    } else {
      user.subscriptions = [];
    }
    return user;
  }

  async findOneWithPassword(id: number): Promise<User | undefined> {
    return await this.repo.findOne(id);
  }
  async findOneByResetToken(
    resetPasswordToken: string
  ): Promise<User | undefined> {
    return await this.repo.findOne({ where: { resetPasswordToken } });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.repo.findOne({ where: { email } });
  }

  async generatePasswordToken(user: User): Promise<string> {
    const token = await bcrypt.hash(randomBytes(20).toString(), 10);
    await this.getRepo().update(user.id, { resetPasswordToken: token });
    return 'https://vecolo.fr/auth/reset-password?token=' + token;
  }
}
