import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

export interface Config {
  port: number | string;
  jwtSecret: string;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbSchema: string;
  dbPort: number | string;
  dbType: string;
  logs: { level: string };
  endpointPrefix: string;
}
let config: Config;

if (process.env.NODE_ENV === 'development') {
  config = {
    port: 4562,
    jwtSecret: 'vécolo JWT secret',
    dbUser: 'root',
    dbPassword: 'root',
    dbSchema: 'vecolo',
    dbPort: 3306,
    dbType: 'mariadb',
    dbHost: 'localhost',
    logs: {
      level: 'debug',
    },
    endpointPrefix: 'api',
  };
} else if (process.env.NODE_ENV === 'test') {
  config = {
    port: 4562,
    jwtSecret: 'vécolo JWT secret',
    dbUser: 'root',
    dbPassword: 'root',
    dbSchema: 'vecolo_test',
    dbPort: 3306,
    dbType: 'mariadb',
    dbHost: 'localhost',
    logs: {
      level: 'debug',
    },
    endpointPrefix: 'api',
  };
} else {
  config = {
    port: process.env.PORT || 8000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbSchema: process.env.DB_DATABASE,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbType: process.env.DB_TYPE,
    jwtSecret: process.env.JWT_SECRET,
    logs: {
      level: process.env.LOG_LEVEL,
    },
    endpointPrefix: process.env.ENDPOINT_PREFIX || '',
  };
}

export default config;
