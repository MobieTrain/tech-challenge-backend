import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('actor', function (table) {
    table.increments('id').primary()
    table.string('name', 150).notNullable()
    table.string('bio', 255).notNullable()
    table.date('born_at').notNullable()
    table.unique(['name'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('actor')
}

