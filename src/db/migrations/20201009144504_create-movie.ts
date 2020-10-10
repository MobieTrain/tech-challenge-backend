import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('movie', function (table) {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.string('synopsis', 255).nullable()
    table.date('released_at').notNullable()
    table.integer('runtime').notNullable()
    table.integer('genreId').unsigned().index()
    table.foreign('genreId').references('id').inTable('genre')
    table.unique(['name'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('movie')
}

