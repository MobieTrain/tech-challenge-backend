import { knex } from '../util/knex'

const MOVIE_TABLE = "movie";

export interface Movie {
  id: number;
  name: string;
  synopsis: string;
  released_at: Date;
  runtime: number;
  genre_id: number;
}

/** @returns the ID that was created */
export async function create(
  name: string,
  synopsis: string,
  released_at: Date,
  runtime: number,
  genre_id: number,
): Promise<number> {
  const [id] = await (knex.into(MOVIE_TABLE).insert({
    name,
    synopsis,
    released_at,
    runtime,
    genre_id,
  }))
  return id
}

export function list(): Promise<Movie[]> {
  return knex.from(MOVIE_TABLE).select()
}

export function find(id: number): Promise<Movie> {
  return knex.from(MOVIE_TABLE).where({ id }).first()
}

export async function remove(id: number): Promise<boolean> {
  const count = await knex.from(MOVIE_TABLE).where({ id }).delete()
  return count > 0
}

export async function update(
  id: number,
  name: string,
  synopsis: string,
  released_at: Date,
  runtime: number,
  genre_id: number,
): Promise<boolean> {
  const count = await knex.from(MOVIE_TABLE).where({ id }).update({
    name,
    synopsis,
    released_at,
    runtime,
    genre_id,
  })
  return count > 0
}
