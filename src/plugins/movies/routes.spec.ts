import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import * as Hapi from '@hapi/hapi'
import { movies as plugin } from './index'
import * as lib from '../../lib/movies'

describe('plugin', () => describe('movies', () => {
  const sandbox = Object.freeze(sinon.createSandbox())

  const isContext = (value: unknown): value is Context => {
    if (!value || typeof value !== 'object') return false
    const safe = value as Partial<Context>
    if (!safe.server) return false
    if (!safe.stub) return false
    return true
  }
  interface Context {
    server: Hapi.Server
    stub: Record<string, sinon.SinonStub>
  }
  interface Flags extends script.Flags {
    readonly context: Partial<Context>
  }

  before(async ({ context }: Flags) => {
    context.stub = {
      lib_list: sandbox.stub(lib, 'list'),
      lib_create: sandbox.stub(lib, 'create'),
      lib_update: sandbox.stub(lib, 'update'),
      lib_find: sandbox.stub(lib, 'find'),
      lib_remove: sandbox.stub(lib, 'remove'),
    }

    // all stubs must be made before server starts
    const server = Hapi.server()
    await server.register(plugin)
    await server.start()
    context.server = server
  })

  beforeEach(({ context }: Flags) => {
    if (!isContext(context)) throw TypeError()

    context.stub.lib_list.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_create.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_update.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_find.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_remove.rejects(new Error('test execution should provide a mock for the result'))
  })

  afterEach(() => sandbox.resetHistory())
  after(() => sandbox.restore())

  describe('GET /movies', () => {

    it('returns all movies', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: 'GET', url: '/movies' }
      const movies = [{
        name: 'happy movie',
        synopsis: 'lorem ipsum',
        released_at: new Date(),
        runtime: 190,
        genre_id: 1,
      }]
      context.stub.lib_list.resolves(movies)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(200)
      expect(response.result).equals(movies)
    })

  })

  describe('POST /movies', () => {

    it('validates payload is not empty', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: 'POST', url: '/movies' }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('validates payload is in movie format', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = {
        synopsis: 'lorem ipsum',
        released_at: new Date(),
        runtime: 190,
        genre_id: 1,
      }
      const opts: Hapi.ServerInjectOptions = { method: 'POST', url: '/movies', payload }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('returns HTTP 201, with the `id` and `path` to the row created', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = {
        name: 'happy movie',
        synopsis: 'lorem ipsum',
        released_at: new Date(),
        runtime: 190,
        genre_id: 1,
      }
      const opts: Hapi.ServerInjectOptions = { method: 'POST', url: '/movies', payload }
      const movie = 1
      context.stub.lib_create.resolves(movie)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(201)

      sinon.assert.calledOnceWithExactly(
        context.stub.lib_create,
        payload.name,
        payload.released_at,
        payload.runtime,
        payload.genre_id,
        payload.synopsis,
      )
      expect(response.result).equals({
        id: movie,
        path: `/movies/${movie}`
      })
    })

    it('should create without synopsys (optional)', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = {
        name: 'happy movie',
        released_at: new Date(),
        runtime: 190,
        genre_id: 1,
      }
      const opts: Hapi.ServerInjectOptions = { method: 'POST', url: '/movies', payload }
      const movie = 1
      context.stub.lib_create.resolves(movie)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(201)

      sinon.assert.calledOnceWithExactly(
        context.stub.lib_create,
        payload.name,
        payload.released_at,
        payload.runtime,
        payload.genre_id,
        undefined,
      )
      expect(response.result).equals({
        id: movie,
        path: `/movies/${movie}`
      })
    })


  })

  describe('GET /movies/:id', () => {
    const paramId = 123
    const [method, url] = ['GET', `/movies/${paramId}`]

    it('validates :id is numeric', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url: '/movies/abc' }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('returns HTTP 404 when :id is not found', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url }
      context.stub.lib_find.resolves(null)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(404)
    })

    it('returns one actor by id', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url }
      const movie = {
        name: 'happy movie',
        synopsis: 'lorem ipsum',
        released_at: new Date(),
        runtime: 190,
        genre_id: 1,
      }
      context.stub.lib_find.resolves(movie)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(200)
      expect(response.result).equals(movie)
    })

  })

  describe('PUT /movies/:id', () => {
    const paramId = 123
    const [method, url] = ['PUT', `/movies/${paramId}`]

    it('validates payload is not empty', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url, payload: undefined }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('validates payload matches `movie`', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url, payload: { 'unexpected': 'object' } }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('should update without synopsys (optional)', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = {
        name: 'happy movie',
        released_at: new Date(),
        runtime: 190,
        genre_id: 1,
      }
      const opts: Hapi.ServerInjectOptions = { method, url, payload }
      context.stub.lib_update.resolves(1)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(204)

      sinon.assert.calledOnceWithExactly(
        context.stub.lib_update,
        123,
        payload.name,
        payload.released_at,
        payload.runtime,
        payload.genre_id,
        undefined,
      )
      expect(response.result).to.be.null()
    })

    it('returns HTTP 404 when :id is not found', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = {
        name: 'happy movie',
        released_at: new Date(),
        runtime: 190,
        genre_id: 1,
        synopsis: 'hello world',
      }
      const opts: Hapi.ServerInjectOptions = { method, url, payload }
      context.stub.lib_update.resolves(0)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(404)
    })

    it('returns HTTP 204', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = {
        name: 'happy movie',
        released_at: new Date(),
        runtime: 190,
        genre_id: 1,
        synopsis: 'hello world',
      }
      const opts: Hapi.ServerInjectOptions = { method, url, payload }
      const anyResult = 1
      context.stub.lib_update.resolves(anyResult)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(204)

      sinon.assert.calledOnceWithExactly(
        context.stub.lib_update,
        123,
        payload.name,
        payload.released_at,
        payload.runtime,
        payload.genre_id,
        payload.synopsis,
      )
      expect(response.result).to.be.null()
    })

  })

  describe('DELETE /movies/:id', () => {
    const paramId = 123
    const [method, url] = ['DELETE', `/movies/${paramId}`]

    it('validates :id is numeric', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url: '/movies/abcd' }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('returns HTTP 404 when :id is not found', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url }
      context.stub.lib_remove.resolves(0)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(404)
    })

    it('returns bad request with proper movies have related actors', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url }
      context.stub.lib_remove.rejects({ code: 'ER_ROW_IS_REFERENCED_2'})

      const response = await context.server.inject(opts)
      expect(response.result).to.equal({
        statusCode: 400,
        error: 'Bad Request',
        message: 'movie has related actors'
      })
      expect(response.statusCode).equals(400)
    })

    it('returns HTTP 204', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url }
      context.stub.lib_remove.resolves(1)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(204)

      sinon.assert.calledOnceWithExactly(context.stub.lib_remove, paramId)
      expect(response.result).to.be.null()
    })

  })

}))
