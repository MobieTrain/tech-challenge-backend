import { ServerRoute, ResponseToolkit, Lifecycle } from '@hapi/hapi'

export const healthRoutes: ServerRoute[] = [{
	method: 'GET',
	path: '/health',
	handler: _get,
},]

function _get(_request: Request, _h: ResponseToolkit, _err?: Error): Lifecycle.ReturnValue {
	return 'ok'
}
