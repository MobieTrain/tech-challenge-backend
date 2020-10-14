import { knex } from '../util/knex'

export const GENRE_TABLE = 'genre'

export interface Genre {
  id: number
  name: string
}

export function list(): Promise<Genre[]> {
  return knex.from(GENRE_TABLE).select()
}

export function find(id: number): Promise<Genre> {
  return knex.from(GENRE_TABLE).where({ id }).first()
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from(GENRE_TABLE).where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(name: string): Promise<number> {
  const [ id ] = await (knex.into(GENRE_TABLE).insert({ name }))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string): Promise<boolean>  {
  const count = await knex.from(GENRE_TABLE).where({ id }).update({ name })
  return count > 0
}
