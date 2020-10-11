import { Plugin } from '@hapi/hapi'
import { health } from './health'
import { movies } from './movies'
import { genre } from './genres'

export const plugins: Plugin<void>[] = [
  health,
  genre,
  movies,
]
