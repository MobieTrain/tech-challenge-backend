import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cast', function (table) {
    table.increments('id').primary()
    table.integer('movie_id').unsigned().index()
    table.integer('actor_id').unsigned().index()
    table.foreign('movie_id').references('id').inTable('movie').onDelete('CASCADE')
    table.foreign('actor_id').references('id').inTable('actor').onDelete('CASCADE')
    table.string( 'character_name')
    table.unique(['movie_id', 'actor_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('cast')
}

