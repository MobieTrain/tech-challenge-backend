import { script } from '@hapi/lab'
import { expect } from '@hapi/code'

import sinon from 'sinon'

export const lab = script()
const { afterEach, describe, it } = lab

import { create, remove, list, find, update, addToTheCast } from './movies'
import { knex } from '../util/knex'

describe('lib', () => describe('genre', () => {
  const sandbox = Object.freeze(sinon.createSandbox())

  afterEach(() => {
    sandbox.resetHistory()
    sandbox.restore()
  })

  describe('create', () => {

    it('insert one row into table `movies` and return created id', async () => {
      const knex_into = sandbox.stub(knex, 'into')
      knex_into.returnsThis()
      const knex_insert = sandbox.stub(knex, 'insert')
      knex_insert.resolves([7])
      const dummy = { name: "foo", released_at: new Date("2020-10-12T19:29:51.479Z"), runtime: 200, genre_id: 1 }

      const id = await create(dummy.name, dummy.released_at, dummy.runtime, dummy.genre_id)
      expect(id).to.equal(7);
      expect(knex_into.firstCall.firstArg).to.equal(`movie`);
      expect(knex_insert.firstCall.firstArg).to.equal({synopsis: undefined, ...dummy});
    })

  })

  describe('list', () => {

    it('returns rows from table `actor`', async () => {
      const knex_from = sandbox.stub(knex, 'from')
      knex_from.returnsThis()
      const knex_select = sandbox.stub(knex, 'select')
      const dummy = [{
        id: 123,
        name: "foo",
        released_at: new Date("2020-10-12T19:29:51.479Z"),
        runtime: 32,
        synopsis: undefined,
      }];

      knex_select.resolves(dummy)

      const data = await list();
      expect(data).to.equal(dummy);
      expect(knex_from.firstCall.firstArg).to.equal(`movie`);
    })

  })

  describe('remove', () => {

    it('should remove row from database by id', async () => {
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      sandbox.stub(knex, 'delete').resolves(1)
      const found = await remove(1);
      expect(knex_where.firstCall.firstArg).to.equal({ id: 1 })
      expect(knex_from.firstCall.firstArg).to.equal("movie")
      expect(found).to.equal(true);
    })

    it('should indicate wether the value was in database', async () => {
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      sandbox.stub(knex, 'delete').resolves(0)
      const found = await remove(2);
      expect(knex_where.firstCall.firstArg).to.equal({ id: 2 })
      expect(knex_from.firstCall.firstArg).to.equal("movie")
      expect(found).to.equal(false);
    })

  })

  describe('update', () => {

    it('should update row from database by id', async () => {
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      const knex_update = sandbox.stub(knex, 'update').resolves(1)
      const dummy = {
        name: "movie",
        synopsis: "syn",
        released_at: new Date("2020-10-12T19:29:51.479Z"),
        runtime: 88,
        genre_id: 1,
      }
      const found = await update(123, dummy.name, dummy.released_at, dummy.runtime, dummy.genre_id, dummy.synopsis);
      expect(knex_update.firstCall.firstArg).to.equal(dummy)
      expect(knex_where.firstCall.firstArg).to.equal({ id: 123 })
      expect(knex_from.firstCall.firstArg).to.equal("movie")
      expect(found).to.equal(true);
    })

    it('should indicate wether the value was found to be updated', async () => {
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      const knex_update = sandbox.stub(knex, 'update').resolves(0)
      const dummy = {
        name: "movie",
        synopsis: "syn",
        released_at: new Date("2020-10-12T19:29:51.479Z"),
        runtime: 88,
        genre_id: 1,
      }
      const found = await update(123, dummy.name, dummy.released_at, dummy.runtime, dummy.genre_id, dummy.synopsis);
      expect(knex_update.firstCall.firstArg).to.equal(dummy)
      expect(knex_where.firstCall.firstArg).to.equal({ id: 123 })
      expect(knex_from.firstCall.firstArg).to.equal("movie")
      expect(found).to.equal(false);
    })

  })

  describe('find', () => {

    it('returns one row from table `movie`, by `id`', async () => {
      const dummy = {
        id: 123,
        name: "movie",
        synopsis: "syn",
        released_at: new Date("2020-10-12T19:29:51.479Z"),
        runtime: 88,
        genre_id: 1,
      }
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      sandbox.stub(knex, 'first').resolves(dummy)
      const movie = await find(123)
      expect(knex_where.firstCall.firstArg).to.equal({ id: 123 })
      expect(knex_from.firstCall.firstArg).to.equal("movie")
      expect(movie).to.equal(dummy as any);
    })

  })

  describe('addToTheCast', () => {

    it('should add actors to the movie cast if actor is not already added', async () => {
      sandbox.stub(knex, 'count').returnsThis()
      sandbox.stub(knex, 'from').returnsThis()
      sandbox.stub(knex, 'where').returnsThis()
      sandbox.stub(knex, 'first').resolves({ 'count(`movie_id`)': 0 })
      sandbox.stub(knex, 'into').returnsThis()
      const knex_insert = sandbox.stub(knex, 'insert').resolves()
      await addToTheCast(1, [2,3,4])
      
      expect(knex_insert.args[0]).to.equal([ { movie_id: 1, actor_id: 2 } ]) // first call
      expect(knex_insert.args[1]).to.equal([ { movie_id: 1, actor_id: 3 } ]) // second call
      expect(knex_insert.args[2]).to.equal([ { movie_id: 1, actor_id: 4 } ]) // third call
    })

    it('should not add actors to the movie cast if actor is already in the cast', async () => {
      sandbox.stub(knex, 'count').returnsThis()
      sandbox.stub(knex, 'from').returnsThis()
      sandbox.stub(knex, 'where').returnsThis()
      sandbox.stub(knex, 'first').resolves({ 'count(`movie_id`)': 1 })
      sandbox.stub(knex, 'into').returnsThis()
      const knex_insert = sandbox.stub(knex, 'insert').resolves()
      await addToTheCast(1, [2,3,4])

      expect(knex_insert.notCalled).to.equal(true)
    })

  })
}))
