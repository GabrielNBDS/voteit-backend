import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

import AppError from './Errors/AppError';
import routes from './index.routes';

dotenv.config();

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(helmet());
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

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// eslint-disable-next-line no-console
server.listen(3333, () => console.log('Server Started'));
