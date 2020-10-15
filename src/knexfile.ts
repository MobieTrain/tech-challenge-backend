import { Config } from 'knex'

// this file is used either by the API and the `knex` client tool

if(!process.env.API_SQL_HOST)     throw new Error('Missing ENV variable `API_SQL_HOST`.')
if(!process.env.API_SQL_PORT)     throw new Error('Missing ENV variable `API_SQL_PORT`.')
if(!process.env.API_SQL_SCHEMA)   throw new Error('Missing ENV variable `API_SQL_SCHEMA`.')
if(!process.env.API_SQL_USER)     throw new Error('Missing ENV variable `API_SQL_USER`.')
if(!process.env.API_SQL_PASSWORD) throw new Error('Missing ENV variable `API_SQL_PASSWORD`.')

const knexConfig: Config = {
  client: 'mysql',
  connection: {
    host: process.env.API_SQL_HOST,
    port: parseInt(process.env.API_SQL_PORT, 10),
    database: process.env.API_SQL_SCHEMA,
    user: process.env.API_SQL_USER,
    password: process.env.API_SQL_PASSWORD,
  },
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
}

export default knexConfig
