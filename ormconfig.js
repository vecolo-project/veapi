/* eslint-disable @typescript-eslint/no-var-requires */
const config =
  process.env.NODE_ENV === 'production'
    ? require('./dist/config').default
    : require('./src/config').default;

const srcConfig = {
  type: config.dbType,
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbSchema,
  username: config.dbUser,
  password: config.dbPassword,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: false,
  entities: ['src/api/entities/**/*.ts'],
  migrations: ['src/database/migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/api/entities',
    migrationsDir: 'src/database/migration',
  },
};

const distConfig = {
  type: config.dbType,
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbSchema,
  username: config.dbUser,
  password: config.dbPassword,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: false,
  logging: false,
  entities: ['dist/api/entities/**/*.js'],
  migrations: ['dist/database/migration/**/*.js'],
  cli: {
    entitiesDir: 'dist/api/entities',
    migrationsDir: 'dist/database/migration',
  },
};

module.exports = process.env.NODE_ENV === 'production' ? distConfig : srcConfig;
