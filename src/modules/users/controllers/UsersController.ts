import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import { hash } from 'bcryptjs';
import knex from '../../../database/connection';
import AppError from '../../../Errors/AppError';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const duplicatedEmail = await knex('users').where({ email }).first();

    if (duplicatedEmail) {
      throw new AppError('Email already taken', 400);
    }

    const hashedPassword = await hash(password, 8);

    const id = uuid();

    await knex('users').insert({
      id,
      name,
      email,
      password: hashedPassword,
    });

    const user = await knex('users').where({ id }).first();

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
