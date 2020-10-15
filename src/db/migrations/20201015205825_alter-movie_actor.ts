import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE movie_actor
    ADD COLUMN character_name VARCHAR(200) NOT NULL DEFAULT '';`)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('ALTER TABLE movie_actor DROP COLUMN character_name;')
}
