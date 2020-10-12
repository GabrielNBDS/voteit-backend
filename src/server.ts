import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import * as dotenv from 'dotenv';

import AppError from './Errors/AppError';
import routes from './index.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

// eslint-disable-next-line no-console
app.listen(3333, () => console.log('Server Started'));
