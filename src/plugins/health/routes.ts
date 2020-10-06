import { ServerRoute, ResponseToolkit, Lifecycle } from '@hapi/hapi'
import * as health from '../../lib/health'

export const healthRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/health',
  handler: _get,
},]

async function _get(_request: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return health.check()
}
