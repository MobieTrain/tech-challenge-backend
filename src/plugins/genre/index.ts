import { Server, Plugin } from '@hapi/hapi'
import { genreRoutes } from './routes'

export const genre: Plugin<any> = {
	name: 'genre',
	version: '1.0.0',
	multiple: false,
	register: (server: Server, _options: any) => server.route(genreRoutes)
}
