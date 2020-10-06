import * as Hapi from '@hapi/hapi'
import { plugins } from './plugins'

const init = async (port = '8080') => {

  const server = Hapi.server({ port })

  await server.register(plugins)
  await server.start()

  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})


Object.keys(process.env)
  .filter(it => it.startsWith('API_'))
  .sort()
  .forEach(it => console.debug(`${it}=${process.env[it]}`))

init(process.env.MT_PORT)
