import jwt from 'express-jwt';
export type Token = jwt.Options;

export type Factory<Entity> = (
  data?: Partial<Entity>
) => Promise<Entity> | Entity;
