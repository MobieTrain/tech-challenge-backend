import { Plugin } from '@hapi/hapi'
import { health } from './health'

export const plugins: Plugin<any>[] = [
  health
]
