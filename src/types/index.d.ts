import jwt from 'express-jwt';
import { User } from '../api/entities/User';

export type Token = jwt.Options;

declare global {
  namespace Express {
    export interface Request {
      currentUser: User;
      token: Token;
    }
  }
}
