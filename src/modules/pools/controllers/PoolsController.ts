import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import aws from 'aws-sdk';
import knex from '../../../database/connection';
import AppError from '../../../Errors/AppError';

const s3 = new aws.S3();

interface Pool {
  id: string;
  name: string;
  user_id: string;
}

interface Candidate {
  image: string;
}

class PoolsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name } = request.body;

    const duplicatedName = await knex('pools').where({ name }).first();

    if (duplicatedName) {
      throw new AppError('Name already taken');
    }

    const pool_id = uuid();

    await knex('pools').insert({
      id: pool_id,
      name,
      user_id: id,
    });

    const pool = await knex('pools').where({ id: pool_id }).first();

    return response.json(pool);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const pools: Pool[] = await knex
      .select()
      .from('pools')
      .where({ user_id: id });

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

    const candidates: Candidate[] = await knex
      .select()
      .from('candidates')
      .where({ pool_id: id });

    if (candidates.length > 0) {
      for (let i = 0; i < candidates.length; i++) {
        s3.deleteObject({
          Bucket: 'voteit-bucket',
          Key: candidates[i].image.replace(
            'https://voteit-bucket.s3.amazonaws.com/',
            '',
          ),
        })
          .promise()
          .then(() => {
            // eslint-disable-next-line no-console
            console.log('deleted');
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.log(`error: ${err}`);
          });
      }
    }

    await knex('pools').where({ id }).del();

    return response.json({ message: 'pool deleted' });
  }
}

export default PoolsController;
