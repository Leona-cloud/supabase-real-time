import { config } from 'dotenv';

config();

export const allowedDomains =
  process.env.ALLOWED_DOMAINS! && process.env.ALLOWED_DOMAINS.split(',');
export const isProduction: boolean = process.env.NODE_ENV === 'production';
export const port: number = parseInt(process.env.PORT ?? '4000');

//prod deployment env
export const isProdEnvironment = process.env.ENVIRONMENT === 'production';

export const frontendDevOrigin = [/^http:\/\/localhost:\d+$/];
