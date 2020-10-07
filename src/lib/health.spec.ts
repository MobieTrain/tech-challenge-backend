import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import { check } from './health'
import { knex } from '../util/knex'

describe('lib', () => describe('health', () => {
  const sandbox = Object.freeze(sinon.createSandbox())

  const isContext = (value: unknown): value is Context => {
    if(!value || typeof value !== 'object') return false
    const safe = value as Partial<Context>
    if(!safe.stub) return false
    return true
  }
  interface Context {
    stub: Record<string, sinon.SinonStub>
  }
  interface Flags extends script.Flags {
    readonly context: Partial<Context>
  }

  before(({context}: Flags) => {
    context.stub = {
      knex_raw: sandbox.stub(knex, 'raw'),
      console: sandbox.stub(console, 'error'),
    }
  })

  beforeEach(({context}: Flags) => {
    if(!isContext(context)) throw TypeError()
    context.stub.knex_raw.resolves()
  })

  afterEach(() => sandbox.resetHistory())
  after(() => sandbox.restore())

  it('returns status for http', async () => {
    const res = await check()
    expect<Record<string, boolean>>(res).contains({http: true})
  })

  it('returns true as status for db when ok', async () => {
    const res = await check()
    expect<Record<string, boolean>>(res).contains({db: true})
  })

  it('returns false as status for db when error', async ({context}: Flags) => {
    if(!isContext(context)) throw TypeError()
    context.stub.knex_raw.rejects('any error')

    const res = await check()
    expect<Record<string, boolean>>(res).contains({db: false})
  })


}))
