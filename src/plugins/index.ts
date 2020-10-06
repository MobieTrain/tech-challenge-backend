import { Plugin } from '@hapi/hapi'
import { health } from './health'
import { genre } from './genres'

export const plugins: Plugin<void>[] = [
  health,
  genre,
]
