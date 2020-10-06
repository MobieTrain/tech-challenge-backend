import { Server, Plugin } from '@hapi/hapi'
import { healthRoutes } from './routes'

export const health: Plugin<void> = {
	name: 'health',
	version: '1.0.0',
	multiple: false,
	register: (server: Server, _options: void) => server.route(healthRoutes)
}
