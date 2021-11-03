import * as dotenv from 'dotenv';
dotenv.config();

const getEnv = (variable: string, optional: boolean = false) => {
  if (!process.env[variable]) {
    if (optional) {
      console.warn(`[@env]: Environmental variable for ${variable} is not supplied. \n So a default value will be generated for you.`);
    } else {
      throw new Error(`You must create an environment variable for ${variable}`);
    }
  }

  return process.env[variable]?.replace(/\\n/gm, '\n');
};

const ENV = {
  isDev: String(getEnv('NODE_ENV')).toLowerCase().includes('dev'),
  isTest: String(getEnv('NODE_ENV')).toLowerCase().includes('test'),
  isProd: String(getEnv('NODE_ENV')).toLowerCase().includes('prod'),
  isStaging: String(getEnv('NODE_ENV')).toLowerCase().includes('staging'),
  env: getEnv('NODE_ENV'),
};


const EVENTS = "test";

export default {
  APP: getEnv('APP') || 'development',
  PORT: getEnv('PORT') || '3000',
  ENV,
  EVENTS,
  DB_DIALECT: getEnv('DB_DIALECT') || 'mongo',
  DB_HOST: getEnv('DB_HOST') || 'mongodb://localhost:27017/example_db',
  DB_NAME: getEnv('DB_NAME') || 'example_db',
  DB_PASSWORD: getEnv('DB_PASSWORD') || 'db-password',
  DB_PORT: getEnv('DB_PORT') || '27017',
  DB_USER: getEnv('DB_USER') || 'root',
  SLACK_SIGNING_SECRET: getEnv("SLACK_SIGNING_SECRET") || "",
  SLACK_BOT_TOKEN: getEnv("SLACK_BOT_TOKEN") || "",
  JWT_ENCRYPTION: getEnv('JWT_ENCRYPTION') || 'jwt_please_change',
  JWT_EXPIRATION: getEnv('JWT_EXPIRATION') || '1h',
  SALT_ROUNDS: getEnv('SALT_ROUNDS') || 10
};
