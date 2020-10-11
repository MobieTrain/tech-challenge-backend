import { knex } from '../util/knex'
import { Movie } from './movies'

export interface Actor {
  id: number
  name: string
  bio: string
  born_at: Date
}

export interface Cast {
  actor_id: number
  movie_id: number
  character_name: string
}

export function list(): Promise<Actor[]> {
  return knex.from('actor').select()
}

export function find(id: number): Promise<Actor> {
  return knex.from('actor').where({ id }).first()
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from('actor').where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(name: string, bio: string, bornAt: Date): Promise<number> {
  const [ id ] = await (knex.into('actor').insert({
    name, bio, born_at: bornAt
  }))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string, bio: string, bornAt: Date): Promise<boolean>  {
  const count = await knex.from('actor').where({ id }).update({
    name, bio, born_at: bornAt
  })
  return count > 0
}

/**
 * Return a list of characters given an actor
 * @param actorId
 */
export function characters(actorId: number): Promise<string[]> {
  return knex.from('cast').where('actor_id', actorId).select('character_name')
}


/** @returns the ID that was created */
export async function createCharacter(actor_id: number, movie_id: number, characterName: string): Promise<number> {
  const [ id ] = await (knex.into('cast').insert({
    actor_id, movie_id, character_name: characterName
  }))

  return id
}

/** @returns the actor's movie **/
export async function movies(actorId: number): Promise<Movie[]> {
  return knex.select(
    'movie.id',
    'movie.name',
    'movie.synopsis',
    'movie.runtime',
    {genre_name: 'genre.name'})
    .from('movie')
    .innerJoin('cast', 'movie.id', 'cast.movie_id')
    .innerJoin('genre', 'genre.id', 'movie.genre_id')
    .where('cast.actor_id', actorId)
}
