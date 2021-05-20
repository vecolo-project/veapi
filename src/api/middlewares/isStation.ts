import jwt from 'express-jwt';
import config from '../../config';
import { getTokenFromHeader } from './isAuth';

const isStation = jwt({
  secret: config.jwtSecret, // The _secret_ to sign the JWTs
  requestProperty: 'token', // Use req.token to store the JWT
  getToken: getTokenFromHeader, // How to extract the JWT from the request
  algorithms: ['HS256'], // Use the HS256 (HMAC with SHA-256) algorithm
});

export default isStation;
