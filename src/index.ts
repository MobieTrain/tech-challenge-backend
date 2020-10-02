import * as Hapi from '@hapi/hapi'

const init = async () => {
  const server = Hapi.server({
    port: 6666
  })

  await server.start()

  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

init()