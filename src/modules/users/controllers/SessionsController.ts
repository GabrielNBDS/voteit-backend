import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import knex from '../../../database/connection';
import AppError from '../../../Errors/AppError';

class SessionsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const user = await knex('users').where('email', email).first();

    if (!user) {
      throw new AppError('Incorrect Email/Password validation.', 401);
    }

    if (!(await compare(password, user.password))) {
      throw new AppError('Incorrect Email/Password validation.', 401);
    }

    if (!process.env.APP_SECRET) {
      throw new Error();
    }

    const token = sign({}, process.env.APP_SECRET, {
      subject: user.id,
      expiresIn: '1d',
    });

    delete user.password;

    return response.json({
      user,
      token,
    });
  }
  
  async check(request: Request, response: Response): Promise<Response> {
    return response.json({ authorized: true});
  }
}

export default SessionsController;
