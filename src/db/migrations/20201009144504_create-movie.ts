import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('movie', function (table) {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.string('synopsis', 255).nullable()
    table.date('released_at').notNullable()
    table.integer('runtime').notNullable()
    table.integer('appearances').nullable().defaultTo(0)
    table.integer('genre_id').unsigned().index()
    table.foreign('genre_id').references('id').inTable('genre')
    table.unique(['name'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('movie')
}

