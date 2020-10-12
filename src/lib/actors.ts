import { knex } from '../util/knex'
import { GENRE_TABLE } from './genres';
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
  born_at: Date,
  bio?: string,
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

export function listGenderFrequency(id: number): Promise<Array<{ gender: string, frequency: number }>> {
  return knex
    .select(GENRE_TABLE + ".name as gender")
    .count(GENRE_TABLE + ".name as frequency")
    .from(ACTOR_TABLE)
    .join(MOVIE_ACTOR_TABLE, ACTOR_TABLE + '.id', '=', MOVIE_ACTOR_TABLE + '.actor_id')
    .join(MOVIE_TABLE, MOVIE_TABLE + '.id', '=', MOVIE_ACTOR_TABLE + '.movie_id')
    .join(GENRE_TABLE, GENRE_TABLE + '.id', '=', MOVIE_TABLE + '.genre_id')
    .where(ACTOR_TABLE + '.id', id)
    .groupBy(GENRE_TABLE + ".name")
}

export function find(id: number): Promise<Actor> {
  return knex.from(ACTOR_TABLE).where({ id }).first()
}

export async function findFavoriteGenre(id: number): Promise<string | null> {
  const frequencyList = await listGenderFrequency(id);
  if (!frequencyList || frequencyList.length < 1) {
    return null;
  }
  return frequencyList
    .sort((a, b) => b.frequency - a.frequency) // desc
    .map(f => f.gender)[0];
}

export async function remove(id: number): Promise<boolean> {
  const count = await knex.from(ACTOR_TABLE).where({ id }).delete()
  return count > 0
}

export async function update(
  id: number,
  name: string,
  born_at: Date,
  bio?: string,
): Promise<boolean> {
  const count = await knex.from(ACTOR_TABLE).where({ id }).update({
    name,
    bio,
    born_at,
  })
  return count > 0
}
