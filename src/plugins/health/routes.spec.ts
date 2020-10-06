import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import * as Hapi from '@hapi/hapi'
import { health as plugin } from './index'
import * as lib from '../../lib/health'

describe('plugin', () => describe('health', () => {
  const sandbox = Object.freeze(sinon.createSandbox())

  const isContext = (value: unknown): value is Context => {
    if(!value || typeof value !== 'object') return false
    const safe = value as Record<string, unknown>
    if(!safe.server) return false
    if(!safe.stub) return false
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
      lib_check: sandbox.stub(lib, 'check'),
    }

    // all stubs must be made before server starts
    const server = Hapi.server()
    await server.register(plugin)
    await server.start()
    context.server = server
  })

  beforeEach(({ context }: Flags) => {
    if(!isContext(context)) throw TypeError()

  })

  afterEach(() => sandbox.resetHistory())
  after(() => sandbox.restore())

  describe('GET /health', () => {

    it('returns the api health', async ({ context }: Flags) => {
      if(!isContext(context)) throw TypeError()
      const opts = { method:'GET', url:'/health' }
      const anyResult = {'any': 'result'}
      context.stub.lib_check.returns(anyResult)

      const response = await context.server.inject(opts)
      sinon.assert.calledOnce(context.stub.lib_check)
      expect(response.result).equals(anyResult)
    })

  })


}))
