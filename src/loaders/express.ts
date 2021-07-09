import cors from 'cors';
import helmet from 'helmet';
import {
  Application,
  json,
  NextFunction,
  Request,
  Response,
  static as expressStatic,
} from 'express';
import apiRoutes from '../api/routes';
import Logger from '../logger';
import config from '../config';
import { ValidationError } from 'class-validator';
import fileUpload from 'express-fileupload';
import { isCelebrateError } from 'celebrate';
import {
  ErrorHandler,
  getMessageFromCelebrateError,
  handleError,
} from '../helpers/ErrorHandler';

export default (app: Application): void => {
  // Health Check endpoints
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });
  app.enable('trust proxy');

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Use Helmet to secure the app by setting various HTTP headers
  app.use(helmet());

  // Middleware that transforms the raw string of req.body into json
  app.use(json());

  // Middleware for fileUpload
  app.use(fileUpload());

  // Load API routes
  app.use(`/${config.endpointPrefix}`, apiRoutes);

  // Give access to uploaded file
  app.use('/uploads', expressStatic('uploads'));

  /// Error handlers
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (isCelebrateError(err)) {
      Logger.error('Error: %o', err);
      res
        .status(400)
        .json({ error: getMessageFromCelebrateError(err) })
        .end();
    } else if (err instanceof Array && err[0] instanceof ValidationError) {
      const messageArr: Array<string> = [];
      let e: ValidationError;
      for (e of err) {
        Object.values(e.constraints).map((msg: string) => {
          messageArr.push(msg);
        });
      }
      Logger.error('Error: %o', messageArr);
      res.status(400).json({ errors: messageArr }).end();
    } else if (err.name === 'UnauthorizedError') {
      /**
       * Handle 401 thrown by express-jwt library
       */
      return res.status(401).json({ error: err.message });
    } else {
      next(err);
    }
  });

  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: ErrorHandler, _req: Request, res: Response, _next: NextFunction) => {
      Logger.error('Error: %o', err.message);
      handleError(err, res);
    }
  );
};
