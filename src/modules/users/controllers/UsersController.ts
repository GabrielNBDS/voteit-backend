import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import { hash } from 'bcryptjs';
import knex from '../../../database/connection';
import AppError from '../../../Errors/AppError';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const duplicatedEmail = await knex('users').where('email', email).first();

    if (duplicatedEmail) {
      throw new AppError('Email already taken', 401);
    }

    const hashedPassword = await hash(password, 8);

    await knex('users').insert({
      id: uuid(),
      name,
      email,
      password: hashedPassword,
    });

    return response.json({ message: 'user created' });
  }

  async read(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const user: User = await knex.select().from('users').where({ id }).first();

    delete user.password;

    return response.json(user);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const { id } = request.user;

    const trx = await knex.transaction();

    await trx('users').where({ id }).update({ name, email });

    if (password) {
      const hashedPassword = await hash(password, 8);
      await trx('users').where({ id }).update({ password: hashedPassword });
    }

    await trx.commit();

    return response.json({ message: 'user updated' });
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    await knex('users').where({ id }).del();

    return response.json({ message: 'user deleted' });
  }
}

export default UsersController;
