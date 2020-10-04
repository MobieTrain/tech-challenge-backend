import { Config } from 'knex'

const knexConfig: Config = {
	client: 'mysql',
	connection: {
    host: process.env.API_SQL_HOST,
    port: parseInt(process.env.API_SQL_PORT, 10),
    database: process.env.API_SQL_SCHEMA,
    user: process.env.API_SQL_USER,
    password: process.env.API_SQL_PASSWORD,
  },
}

export default knexConfig
