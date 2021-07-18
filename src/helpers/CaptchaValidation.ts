import config from '../config';
import { ErrorHandler } from './ErrorHandler';
import fetch from 'node-fetch';

export async function validateCaptcha(token: string): Promise<boolean> {
  const secretKey = config.recaptchaKey;

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  if (token === null || token === undefined) {
    throw new ErrorHandler(400, 'Token is empty or invalid');
  }

  const response = await fetch(url);
  const body = await response.json();

  return body.success !== undefined && body.success === true;
}
