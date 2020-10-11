import {
  ServerRoute,
  ResponseToolkit,
  Lifecycle,
  Request,
} from '@hapi/hapi'

import * as actors from '../../lib/actors'


export const actorRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/actors',
  handler: getAll,
}]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return actors.list()
}
