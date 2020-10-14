import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE actor (
      id      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name    VARCHAR(200),
      bio     TEXT NULL,
      born_at DATE NOT NULL,
      
      CONSTRAINT PK_movie__id PRIMARY KEY (id)
    ) ENGINE = InnoDB;`)

  await knex.schema.raw(`
    CREATE TABLE movie_actor (
      movie_id INT(10) UNSIGNED NOT NULL,
      actor_id INT(10) UNSIGNED NOT NULL,
      PRIMARY KEY (movie_id, actor_id),
      CONSTRAINT FK_movie_actor__movie
        FOREIGN KEY (movie_id)
        REFERENCES movie (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT FK_movie_actor__actor
        FOREIGN KEY (actor_id)
        REFERENCES actor (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    ) ENGINE = InnoDB;`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE movie_actor;')
  await knex.schema.raw('DROP TABLE actor;')
}
