import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE movie (
      id            INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name          VARCHAR(200),
      synopsis      TEXT NULL,
      released_at   DATE NOT NULL,
      runtime       INT NOT NULL,
      genre_id      INT(10) UNSIGNED NOT NULL,

      CONSTRAINT PK_movie__id PRIMARY KEY (id),
      CONSTRAINT UK_movie__name UNIQUE KEY (name),
      CONSTRAINT FK_movie__genre
        FOREIGN KEY (genre_id)
        REFERENCES genre(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    ) ENGINE = InnoDB;`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE movie;')
}
