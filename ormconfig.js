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
  cli: {
    entitiesDir: 'src/api/entities',
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
  cli: {
    entitiesDir: 'dist/api/entities',
  },
};

module.exports = process.env.NODE_ENV === 'production' ? distConfig : srcConfig;
