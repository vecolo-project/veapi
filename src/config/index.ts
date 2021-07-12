import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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
  sendGridApiKey: string;
  sendgridFromEmail: string;
  sendgridReplyEmail: string;
}
let config: Config;

if (process.env.NODE_ENV === 'test') {
  config = {
    port: 3000,
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
    endpointPrefix: '',
    sendGridApiKey: '',
    sendgridFromEmail: '',
    sendgridReplyEmail: '',
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
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    sendgridFromEmail: process.env.SENDGRID_SEND_EMAIL,
    sendgridReplyEmail: process.env.SENDGRID_REPLY_EMAIL,
  };
}

export default config;
