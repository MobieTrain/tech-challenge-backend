import * as Hapi from '@hapi/hapi'
import { plugins } from './plugins'
import { isResponseObject } from './util/types'

const init = async (port = '8080') => {
  const server = Hapi.server({
    port,
    debug: { request: ['error'] }
  })
  await server.register(plugins)
  await server.start()
  server.events.on('response', function (request) {
    if (isResponseObject(request.response)) {
      console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    } else {
      console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path);
    }
  });

  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})


Object.keys(process.env)
  .filter(it => it.startsWith('API_'))
  .sort()
  .forEach(it => console.debug(`${it}=${process.env[it] || '*empty*'}`))

void init(process.env.MT_PORT)
