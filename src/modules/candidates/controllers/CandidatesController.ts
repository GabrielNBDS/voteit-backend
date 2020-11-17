import { Request, Response } from 'express';
import { uuid } from 'uuidv4';
import fs from 'fs';
import path from 'path';
import knex from '../../../database/connection';

interface Candidate {
  id: string;
  name: string;
  image: string;
  short_description: string;
  description: string;
  votes: number;
  pool_id: string;
}

class CandidatesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, short_description, description } = request.body;
    const { location } = request.file;

    const candidate_id = uuid();

    await knex('candidates').insert({
      id: candidate_id,
      name,
      image: location,
      short_description,
      description,
      votes: 0,
      pool_id: id,
    });

    const candidate = await knex('candidates')
      .where({ id: candidate_id })
      .first();

    return response.json(candidate);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const candidates: Candidate[] = await knex
      .select()
      .from('candidates')
      .where({ pool_id: id });

    const pool = await knex('pools').select('name', 'id').where({ id }).first();

    return response.json({ candidates, pool });
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, short_description, description } = request.body;

    await knex('candidates')
      .where({ id })
      .update({ name, short_description, description });

    const candidate = await knex('candidates').where({ id });

    return response.json(candidate);
  }

  async add_vote(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    await knex('candidates').where({ id }).increment('votes', 1);

    const candidate = await knex('candidates').where({ id }).first();

    request.io.emit(candidate.pool_id, candidate);

    return response.json(candidate);
  }

  async update_image(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { location } = request.file;

    const oldImage: Candidate = await knex('candidates').where({ id }).first();
    const [, , , , name] = oldImage.image.split('/');

    fs.unlinkSync(
      path.resolve(__dirname, '..', '..', '..', '..', 'uploads', name),
    );

    await knex('candidates').where({ id }).update({
      image: location,
    });

    const candidate = await knex('candidates').where({ id }).first();

    return response.json(candidate.image);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    await knex('candidates').where({ id }).del();

    return response.json({ message: 'candidate deleted' });
  }
}

export default CandidatesController;
