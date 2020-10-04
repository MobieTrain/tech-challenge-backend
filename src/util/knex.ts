import knexConfig from '../knexfile'
import Knex from 'knex'

export const knex = Knex(knexConfig)
