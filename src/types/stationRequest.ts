import { Request } from 'express';
import { Token } from '.';
import { Station } from '../api/entities/Station';

export interface StationRequest extends Request {
  token: Token;
  currentStation: Station;
}
