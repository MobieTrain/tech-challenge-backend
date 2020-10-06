import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import { list, find, remove, create, update } from './genre'
import { knex } from '../util/knex'

describe('lib', () => describe('genre', () => {
	const sandbox = Object.freeze(sinon.createSandbox())

	before(({context}: { readonly context: Record<string, any> }) => {
		context.stub = {
      knex_from: sandbox.stub(knex, 'from'),
      knex_select: sandbox.stub(knex, 'select'),
      knex_where: sandbox.stub(knex, 'where'),
      knex_first: sandbox.stub(knex, 'first'),
      knex_delete: sandbox.stub(knex, 'delete'),
      knex_into: sandbox.stub(knex, 'into'),
      knex_insert: sandbox.stub(knex, 'insert'),
      knex_update: sandbox.stub(knex, 'update'),
      console: sandbox.stub(console, 'error'),
    }
  })

	beforeEach(({context}: { readonly context: Record<string, any> }) => {
    context.stub.knex_from.returnsThis()
    context.stub.knex_select.returnsThis()
    context.stub.knex_where.returnsThis()
    context.stub.knex_first.returnsThis()
    context.stub.knex_into.returnsThis()
    context.stub.knex_delete.rejects(new Error('test: expectation not provided'))
    context.stub.knex_insert.rejects(new Error('test: expectation not provided'))
    context.stub.knex_update.rejects(new Error('test: expectation not provided'))
  })

  afterEach(() => sandbox.resetHistory())
  after(() => sandbox.restore())

  describe('list', () => {

    it('returns rows from table `genre`', async ({context}: { readonly context: Record<string, any> }) => {
      await list()
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'genre')
      sinon.assert.calledOnce(context.stub.knex_select)
    })

  })

  describe('find', () => {

    it('returns one row from table `genre`, by `id`', async ({context}: { readonly context: Record<string, any> }) => {
      const anyId = 123

      await find(anyId)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'genre')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
      sinon.assert.calledOnce(context.stub.knex_first)
    })

  })

  describe('remove', () => {

    it('removes one row from table `genre`, by `id`', async ({context}: { readonly context: Record<string, any> }) => {
      const anyId = 123
      context.stub.knex_delete.resolves()

      await remove(anyId)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'genre')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
      sinon.assert.calledOnce(context.stub.knex_delete)
    })

    ; [0, 1].forEach( rows =>
    it(`returns ${!!rows} when (${rows}) row is found and deleted`, async ({context}: { readonly context: Record<string, any> }) => {
      context.stub.knex_delete.resolves(rows)
      const anyId = 123

      const result = await remove(anyId)
      expect(result).to.be.boolean()
      expect(result).equals(!!rows)
    }))

  })

  describe('update', () => {

    it('updates one row from table `genre`, by `id`', async ({context}: { readonly context: Record<string, any> }) => {
      const anyId = 123
      const anyName = 'any-name'
      context.stub.knex_update.resolves()

      await update(anyId, anyName)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'genre')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
      sinon.assert.calledOnceWithExactly(context.stub.knex_update, { name: anyName })
    })

    ; [0, 1].forEach( rows =>
    it(`returns ${!!rows} when (${rows}) row is found and deleted`, async ({context}: { readonly context: Record<string, any> }) => {
      const anyId = 123
      const anyName = 'any-name'
      context.stub.knex_update.resolves(rows)

      const result = await update(anyId, anyName)
      expect(result).to.be.boolean()
      expect(result).equals(!!rows)
    }))

  })

  describe('remove', () => {

    it('removes one row from table `genre`, by `id`', async ({context}: { readonly context: Record<string, any> }) => {
      const anyId = 123
      context.stub.knex_delete.resolves()

      await remove(anyId)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'genre')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
      sinon.assert.calledOnce(context.stub.knex_delete)
    })

    ; [0, 1].forEach( rows =>
    it(`returns ${!!rows} when (${rows}) row is found and deleted`, async ({context}: { readonly context: Record<string, any> }) => {
      context.stub.knex_delete.resolves(rows)
      const anyId = 123

      const result = await remove(anyId)
      expect(result).to.be.boolean()
      expect(result).equals(!!rows)
    }))

  })

  describe('create', () => {

    it('insert one row into table `genre`', async ({context}: { readonly context: Record<string, any> }) => {
      const anyName = 'any-name'
      context.stub.knex_insert.resolves([])

      await create(anyName)
      sinon.assert.calledOnceWithExactly(context.stub.knex_into, 'genre')
      sinon.assert.calledOnceWithExactly(context.stub.knex_insert, { name: anyName })
    })

    it('returns the `id` created for the new row', async ({context}: { readonly context: Record<string, any> }) => {
      const anyName = 'any-name'
      const anyId = 123
      context.stub.knex_insert.resolves([anyId])

      const result = await create(anyName)
      expect(result).to.be.number()
      expect(result).equals(anyId)
    })

  })

}))
