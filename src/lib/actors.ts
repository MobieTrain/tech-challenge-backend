import { knex } from '../util/knex'
import { Movie, MOVIE_ACTOR_TABLE, MOVIE_TABLE } from './movies';

const ACTOR_TABLE = "actor";

export interface Actor {
  id: number;
  name: string;
  bio: string;
  born_at: Date;
}

export async function create(
  name: string,
  bio: string,
  born_at: Date,
): Promise<number> {
  const [id] = await (knex.into(ACTOR_TABLE).insert({
    name,
    bio,
    born_at,
  }))
  return id
}

export function list(): Promise<Actor[]> {
  return knex.from(ACTOR_TABLE).select()
}

export function listMovieAppearances(id: number): Promise<Movie[]> {
  return knex
    .select(MOVIE_TABLE + ".*")
    .from(ACTOR_TABLE)
    .join(MOVIE_ACTOR_TABLE, ACTOR_TABLE + '.id', '=', MOVIE_ACTOR_TABLE + '.actor_id')
    .join(MOVIE_TABLE, MOVIE_TABLE + '.id', '=', MOVIE_ACTOR_TABLE + '.movie_id')
    .where(ACTOR_TABLE + '.id', id);
}

export function find(id: number): Promise<Actor> {
  return knex.from(ACTOR_TABLE).where({ id }).first()
}

export async function remove(id: number): Promise<boolean> {
  const count = await knex.from(ACTOR_TABLE).where({ id }).delete()
  return count > 0
}

export async function update(
  id: number,
  name: string,
  bio: string,
  born_at: Date,
): Promise<boolean> {
  const count = await knex.from(ACTOR_TABLE).where({ id }).update({
    name,
    bio,
    born_at,
  })
  return count > 0
}
