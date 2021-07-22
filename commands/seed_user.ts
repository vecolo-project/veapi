import inquirer from 'inquirer';
import databaseLoader from '../src/loaders/database';
import EntitySeed from '../src/database/seeds/EntitySeed';
import { User } from '../src/api/entities/User';
import UserFactory from '../src/database/factories/UserFactory';

const FILLABLE = ['user'];

const fillableToRepo = {
  user: { entity: User, factory: UserFactory },
};

const run = async () => {
  const log = console.log;

  try {
    const answer_1: any = await inquirer.prompt({
      name: 'whatToSeed',
      type: 'list',
      message: 'what do you want to seeds ?',
      choices: FILLABLE,
    });
    const answer_2: any = await inquirer.prompt({
      name: 'howMany',
      type: 'input',
      message: 'how many ?',
      validate: (value) => !Number.isNaN(Number(value)),
    });

    const connection = await databaseLoader();
    log('Database connection loaded successfully!');

    const inserted = await new EntitySeed(
      connection.getRepository(fillableToRepo[answer_1.whatToSeed].entity),
      fillableToRepo[answer_1.whatToSeed].factory
    ).seedMany(answer_2.howMany);
    log(`${inserted.length} ${answer_1.whatToSeed} created!`);
  } catch (err) {
    handleError(err);
  }
  process.exit(0);
};

const handleError = (err: Error) => {
  console.error(err);
  process.exit(1);
};

run();
