import { knex } from '../util/knex'

export interface Actor {
  id: number
  name: string
  bio: string
  born_at: Date
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
