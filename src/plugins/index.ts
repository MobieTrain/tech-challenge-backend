import { Plugin } from '@hapi/hapi'
import { health } from './health'
import { movies } from './movies'
import { genre } from './genres'
import { actors } from './actors'

export const plugins: Plugin<void>[] = [
  health,
  genre,
  movies,
  actors,
]
