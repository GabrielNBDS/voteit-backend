import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import knex from '../../../database/connection';
import AppError from '../../../Errors/AppError';

interface Pool {
  id: string;
  name: string;
  user_id: string;
}

class PoolsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name } = request.body;

    const duplicatedName = await knex('pools').where({ name }).first();

    const pool_id = uuid();

    await knex('pools').insert({
      id: pool_id,
      name,
      user_id: id
    });

    const pool = await knex('pools').where({ id: pool_id}).first();

    return response.json(pool);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const pools: Pool[] = await knex.select().from('pools').where({ user_id: id });

    return response.json(pools);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name } = request.body;

    await knex('pools').where({ id }).update({ name });

    const pool = await knex('pools').where({ id });

    return response.json(pool);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    await knex('pools').where({ id }).del();

    return response.json({ message: 'pool deleted' });
  }
}

export default PoolsController;
