import { knex } from '../util/knex'

export function list(): any {
  return knex('genre')
}

export function find(id: number): any {
  return knex('genre').where({ id }).first()
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex('genre').where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(name: string): Promise<number> {
  const [ id ] = await knex('genre').insert({ name })
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string): Promise<boolean>  {
  const count = await knex('genre').where({ id }).update({ name })
  return count > 0
}
