import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`ALTER TABLE genre ENGINE=INNODB;`);
}


export async function down(knex: Knex): Promise<void> {

}
