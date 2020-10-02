import { Server, Plugin } from '@hapi/hapi'
import { healthRoutes } from './routes'

export const health: Plugin<any> = {
	name: 'health',
	version: '1.0.0',
	multiple: false,
	register: (server: Server, _options: any) => server.route(healthRoutes)
}
