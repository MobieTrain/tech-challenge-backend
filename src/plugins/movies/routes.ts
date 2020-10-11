import {
  ServerRoute,
  ResponseToolkit,
  Lifecycle,
  Request,
} from '@hapi/hapi'

import * as movies from '../../lib/movies'


export const movieRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/movies',
  handler: getAll,
}]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return movies.list()
}
