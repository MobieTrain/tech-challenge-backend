// import { knex } from '../../util/knex'
import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await (knex.into('genre').insert({ name: "Action" }));
  await (knex.into('genre').insert({ name: "Comedy" }));
  await (knex.into('genre').insert({ name: "Drama" }));
  await (knex.into('genre').insert({ name: "Fantasy" }));
  await (knex.into('genre').insert({ name: "Horror" }));
  await (knex.into('genre').insert({ name: "Mystery" }));
  await (knex.into('genre').insert({ name: "Romance" }));
  await (knex.into('genre').insert({ name: "Thriller" }));
}