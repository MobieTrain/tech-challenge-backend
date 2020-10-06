import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE genre (
      id    INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name  VARCHAR(50),

      CONSTRAINT PK_genre__id PRIMARY KEY (id),
      CONSTRAINT UK_genre__name UNIQUE KEY (name)
  );`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE genre;')
}
