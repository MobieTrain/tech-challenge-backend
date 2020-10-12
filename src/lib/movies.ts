import { knex } from '../util/knex'

export const MOVIE_TABLE = "movie";
export const MOVIE_ACTOR_TABLE = "movie_actor";

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
  released_at: Date,
  runtime: number,
  genre_id: number,
  synopsis?: string,
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
  released_at: Date,
  runtime: number,
  genre_id: number,
  synopsis?: string,
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

export async function addToTheCast(
  id: number,
  actorsIds: number[],
): Promise<void> {
  const actorsNotInCast = [];
  for (const actorId of actorsIds) {
    if (!await alreadyInTheCast(id, actorId)) {
      actorsNotInCast.push(actorId);
    }
  }
  await Promise.all(actorsNotInCast.map(actorId => knex.into(MOVIE_ACTOR_TABLE).insert({ 
    movie_id: id,
    actor_id: actorId,
  })));
}

async function alreadyInTheCast(
  id: number,
  actorId: number,
): Promise<boolean> {
  const relations = (await knex.count("movie_id").from(MOVIE_ACTOR_TABLE).where({ 
    movie_id: id,
    actor_id: actorId,
  }).first());
  if (!!relations && relations['count(`movie_id`)'] > 0) {
    return true;
  } else {
    return false;
  }
}