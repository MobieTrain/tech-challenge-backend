import { Server, Plugin } from '@hapi/hapi'
import { genreRoutes } from './routes'

export const genre: Plugin<void> = {
  name: 'genre',
  version: '1.0.0',
  multiple: false,
  register: (server: Server, _options: void) => server.route(genreRoutes)
}
