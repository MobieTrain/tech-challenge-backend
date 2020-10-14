import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import * as Hapi from '@hapi/hapi'
import { actors as plugin } from './index'
import * as lib from '../../lib/actors'

describe('plugin', () => describe('actor', () => {
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
      lib_create: sandbox.stub(lib, 'create'),
      lib_list: sandbox.stub(lib, 'list'),
      lib_listMovieAppearances: sandbox.stub(lib, 'listMovieAppearances'),
      lib_listGenderFrequency: sandbox.stub(lib, 'listGenderFrequency'),
      lib_find: sandbox.stub(lib, 'find'),
      lib_findFavoriteGenre: sandbox.stub(lib, 'findFavoriteGenre'),
      lib_remove: sandbox.stub(lib, 'remove'),
      lib_update: sandbox.stub(lib, 'update'),
    }

    // all stubs must be made before server starts
    const server = Hapi.server()
    await server.register(plugin)
    await server.start()
    context.server = server
  })

  beforeEach(({ context }: Flags) => {
    if (!isContext(context)) throw TypeError()

    context.stub.lib_create.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_list.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_listMovieAppearances.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_listGenderFrequency.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_find.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_findFavoriteGenre.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_remove.rejects(new Error('test execution should provide a mock for the result'))
    context.stub.lib_update.rejects(new Error('test execution should provide a mock for the result'))
  })

  afterEach(() => sandbox.resetHistory())
  after(() => sandbox.restore())

  describe('GET /actors', () => {

    it('returns all actors', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: "GET", url: "/actors" }
      const actors = [{ id: 1, name: 'actor', bio: 'lorem', born_at: new Date() }]
      context.stub.lib_list.resolves(actors)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(200)
      expect(response.result).equals(actors)
    })

  })

  describe('POST /actors', () => {

    it('validates payload is not empty', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: "POST", url: "/actors" }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('validates mandatory `born_at` property', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { name: 'foo' }
      const opts: Hapi.ServerInjectOptions = { method: "POST", url: "/actors", payload }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('validates mandatory `name` property', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { born_at: 'foo' }
      const opts: Hapi.ServerInjectOptions = { method: "POST", url: "/actors", payload }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('returns HTTP 201, with the `id` and `path` to the row created', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { name: 'actor', bio: 'lorem', born_at: new Date() }
      const opts: Hapi.ServerInjectOptions = { method: "POST", url: "/actors", payload }
      const actor = 1
      context.stub.lib_create.resolves(actor)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(201)

      sinon.assert.calledOnceWithExactly(context.stub.lib_create, payload.name, payload.born_at, payload.bio)
      expect(response.result).equals({
        id: actor,
        path: `/actors/${actor}`
      })
    })

    it('should create without bio (optional)', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { name: 'actor', born_at: new Date() }
      const opts: Hapi.ServerInjectOptions = { method: "POST", url: "/actors", payload }
      const actor = 1
      context.stub.lib_create.resolves(actor)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(201)

      sinon.assert.calledOnceWithExactly(context.stub.lib_create, payload.name, payload.born_at, undefined)
      expect(response.result).equals({
        id: actor,
        path: `/actors/${actor}`
      })
    })


  })

  describe('GET /actors/:id', () => {
    const paramId = 123
    const [method, url] = ['GET', `/actors/${paramId}`]

    it('validates :id is numeric', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url: 'not-a-number' }

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
      const actor = { name: 'actor', born_at: new Date() }
      context.stub.lib_find.resolves(actor)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(200)
      expect(response.result).equals(actor)
    })

  })

  describe('PUT /actors/:id', () => {
    const paramId = 123
    const [method, url] = ['PUT', `/actors/${paramId}`]

    it('validates payload is not empty', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url, payload: undefined }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('validates payload matches `actor`', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url, payload: { 'unexpected': 'object' } }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('validates mandatory `born_at` property', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { name: 'foo' }
      const opts: Hapi.ServerInjectOptions = { method, url, payload }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('validates mandatory `name` property', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { born_at: 'foo' }
      const opts: Hapi.ServerInjectOptions = { method, url, payload }

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(400)
    })

    it('should update and return 204 on optional bio property', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { name: 'actor', born_at: new Date() }
      const opts: Hapi.ServerInjectOptions = { method, url, payload }
      const anyResult = 123
      context.stub.lib_update.resolves(anyResult)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(204)

      sinon.assert.calledOnceWithExactly(context.stub.lib_update, paramId, payload.name, payload.born_at, undefined)
      expect(response.result).to.be.null()
    })

    it('returns HTTP 404 when :id is not found', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { name: 'actor', born_at: new Date() }
      const opts: Hapi.ServerInjectOptions = { method, url, payload }
      context.stub.lib_update.resolves(0)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(404)
    })

    it('returns HTTP 204', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const payload = { name: 'actor', born_at: new Date() }
      const opts: Hapi.ServerInjectOptions = { method, url, payload }
      const anyResult = 123
      context.stub.lib_update.resolves(anyResult)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(204)

      sinon.assert.calledOnceWithExactly(context.stub.lib_update, paramId, payload.name, payload.born_at, undefined)
      expect(response.result).to.be.null()
    })

  })

  describe('DELETE /actors/:id', () => {
    const paramId = 123
    const [method, url] = ['DELETE', `/actors/${paramId}`]

    it('validates :id is numeric', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url: `/actors/abcd` }

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

    it('returns HTTP 204', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method, url }
      const anyResult = { 'any': 'result' }
      context.stub.lib_remove.resolves(anyResult)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(204)

      sinon.assert.calledOnceWithExactly(context.stub.lib_remove, paramId)
      expect(response.result).to.be.null()
    })

  })

  describe('GET /actors/:id/movies', () => {

    it('returns HTTP 404 when :id is not found', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: "GET", url: "/actors/1/movies" }
      context.stub.lib_find.resolves(null)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(404)
    })

    it('returns actors movie appearances', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: "GET", url: "/actors/2/movies" }
      const anyDate = new Date();
      const actor = { id: 2, name: 'actor', born_at: anyDate }
      context.stub.lib_find.resolves(actor)
      context.stub.lib_listMovieAppearances.resolves([{
        id: 2,
        name: "Rock and roll 222",
        synopsis: "a synopsys simple as it is 222",
        released_at: anyDate,
        runtime: 22,
        genre_id: 2
      }])
      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(200)
      sinon.assert.calledOnceWithExactly(context.stub.lib_listMovieAppearances, 2)

      expect(response.result).equals({
        id: 2,
        name: 'actor',
        born_at: anyDate,
        movies: [
          {
            id: 2,
            name: 'Rock and roll 222',
            synopsis: 'a synopsys simple as it is 222',
            released_at: anyDate,
            runtime: 22,
            genre_id: 2
          }
        ]
      })
    })

  })

  describe('GET /actors/{id}/movies/genres/favorite', () => {

    it('returns HTTP 404 when :id is not found', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: "GET", url: "/actors/2/movies/genres/favorite" }
      context.stub.lib_find.resolves(null)

      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(404)
    })

    it('returns actors favorite genre', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: "GET", url: "/actors/2/movies/genres/favorite" }
      const anyDate = new Date();
      const actor = { id: 2, name: 'actor', born_at: anyDate }
      context.stub.lib_find.resolves(actor)
      context.stub.lib_findFavoriteGenre.resolves("Horror")
      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(200)
      sinon.assert.calledOnceWithExactly(context.stub.lib_findFavoriteGenre, 2)

      expect(response.result).equals({
        id: 2,
        name: 'actor',
        born_at: anyDate,
        genre: "Horror",
      })
    })

    it('returns empty string if actors has not favorite genre', async ({ context }: Flags) => {
      if (!isContext(context)) throw TypeError()
      const opts: Hapi.ServerInjectOptions = { method: "GET", url: "/actors/2/movies/genres/favorite" }
      const anyDate = new Date();
      const actor = { id: 2, name: 'actor', born_at: anyDate }
      context.stub.lib_find.resolves(actor)
      context.stub.lib_findFavoriteGenre.resolves(null)
      const response = await context.server.inject(opts)
      expect(response.statusCode).equals(200)
      sinon.assert.calledOnceWithExactly(context.stub.lib_findFavoriteGenre, 2)

      expect(response.result).equals({
        id: 2,
        name: 'actor',
        born_at: anyDate,
        genre: "",
      })
    })

  })

}))
