import Knex, { Config } from 'knex'

// create database schema using root user
const knexConfig: Config = {
  client: 'mysql',
  connection: {
    host: process.env.API_SQL_HOST,
    port: parseInt(process.env.API_SQL_PORT, 10),
    database: null,
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
  }
}

async function createDatabase() {
  const schema = process.env.API_SQL_SCHEMA
  const user = process.env.API_SQL_USER

  const knex = Knex(knexConfig)
  await knex.raw(`CREATE DATABASE IF NOT EXISTS ${schema};`);
  await knex.raw(`GRANT ALL ON ${schema}.* TO '${user}'@'%';`);
  await knex.destroy();
}

process.on('unhandledRejection', (err) => {
  console.debug({ knexConfig })
  console.error(err)
  process.exit(1)
})

createDatabase();
