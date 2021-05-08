import { Request } from 'express';
import { User } from 'src/api/entities/User';
import { Token } from '.';

export interface userRequest extends Request {
  token: Token;
  currentUser: User;
}
