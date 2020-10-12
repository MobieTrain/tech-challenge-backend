import { knex } from '../util/knex'

export interface Movie {
  id: number
  name: string
  synopsis?: string
  released_at: Date
  runtime: number
  appearances: number
  genre_id: number
  genre_name: string
}

export function list(): Promise<Movie[]> {
  return knex.from('movie').select()
}

export function find(id: number): Promise<Movie> {
  return knex.from('movie').where({ id }).first()
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from('movie').where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(name: string, synopsis: string, releasedAt: Date, runtime: number, appearances: number, genreId: number): Promise<number> {
  const [ id ] = await (knex.into('movie').insert({
    name, synopsis, released_at: releasedAt, runtime, appearances, genre_id: genreId
  }))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string, synopsis: string, releasedAt: Date, runtime: number, appearances: number, genreId: number): Promise<boolean>  {
  const count = await knex.from('movie').where({ id }).update({
    name, synopsis, released_at: releasedAt, runtime, appearances, genre_id: genreId
  })
  return count > 0
}
