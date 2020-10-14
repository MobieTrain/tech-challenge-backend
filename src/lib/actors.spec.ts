import { script } from '@hapi/lab'
import { expect } from '@hapi/code'

import sinon from 'sinon'

export const lab = script()
const { afterEach, describe, it } = lab

import { create, remove, list, find, listMovieAppearances, listGenderFrequency, findFavoriteGenre, update } from './actors'
import { knex } from '../util/knex'

describe('lib', () => describe('genre', () => {
  const sandbox = Object.freeze(sinon.createSandbox())

  afterEach(() => {
    sandbox.resetHistory()
    sandbox.restore()
  })

  describe('create', () => {

    it('insert one row into table `actor` and return created id', async () => {
      const knex_into = sandbox.stub(knex, 'into')
      knex_into.returnsThis()
      const knex_insert = sandbox.stub(knex, 'insert')
      knex_insert.resolves([22])
      const dummy = { name: 'foo', born_at: new Date('2020-10-12T19:29:51.479Z'), bio: 'lorem' }

      const id = await create(dummy.name, dummy.born_at, dummy.bio)
      expect(id).to.equal(22)
      expect(knex_into.firstCall.firstArg).to.equal('actor')
      expect(knex_insert.firstCall.firstArg).to.equal(dummy)
    })

  })

  describe('list', () => {

    it('returns rows from table `actor`', async () => {
      const knex_from = sandbox.stub(knex, 'from')
      knex_from.returnsThis()
      const knex_select = sandbox.stub(knex, 'select')
      const dummy = [{
        id: 123,
        name: 'foo',
        bio: 'lorem',
        born_at: new Date('2020-10-12T19:29:51.479Z'),
      }]

      knex_select.resolves(dummy)

      const data = await list()
      expect(data).to.equal(dummy)
      expect(knex_from.firstCall.firstArg).to.equal('actor')
    })

  })

  describe('listMovieAppearances', () => {

    it('should query the movies in which the actor appears', async () => {
      const knex_select = sandbox.stub(knex, 'select')
      knex_select.returnsThis()
      const knex_from = sandbox.stub(knex, 'from')
      knex_from.returnsThis()
      const knex_join = sandbox.stub(knex, 'join')
      knex_join.returnsThis()
      const knex_where = sandbox.stub(knex, 'where')
      const dummy = [{
        id: 123,
        name: 'movie',
        synopsis: 'syn',
        released_at: new Date('2020-10-12T19:29:51.479Z'),
        runtime: 88,
        genre_id: 1,
      }]
      knex_where.resolves(dummy)

      const movies = await listMovieAppearances(1)
      expect(knex_select.firstCall.firstArg).to.equal('movie.*')
      expect(knex_from.firstCall.firstArg).to.equal('actor')
      expect(knex_join.args[0]).to.equal(['movie_actor', 'actor.id', '=', 'movie_actor.actor_id'])
      expect(knex_join.args[1]).to.equal(['movie', 'movie.id', '=', 'movie_actor.movie_id'])
      expect<string|number>(knex_where.args[0]).to.equal(['actor.id', 1])
      expect(movies).to.equal(dummy)
    })

  })

  describe('findFavoriteGenre', () => {

    it('should query the genders in which the actor appears and its frequency', async () => {
      const knex_select = sandbox.stub(knex, 'select').returnsThis()
      const knex_count = sandbox.stub(knex, 'count').returnsThis()
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_join = sandbox.stub(knex, 'join').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      const knex_groupBy = sandbox.stub(knex, 'groupBy')
      const dummy = [
        { gender: 'Action', frequency: 2 },
        { gender: 'Horror', frequency: 7 },
        { gender: 'Romance', frequency: 1 },
      ]
      knex_groupBy.resolves(dummy)

      const movies = await listGenderFrequency(1)
      expect(knex_select.firstCall.firstArg).to.equal('genre.name as gender')
      expect(knex_count.firstCall.firstArg).to.equal('genre.name as frequency')
      expect(knex_from.firstCall.firstArg).to.equal('actor')
      expect(knex_join.args[0]).to.equal(['movie_actor', 'actor.id', '=', 'movie_actor.actor_id'])
      expect(knex_join.args[1]).to.equal(['movie', 'movie.id', '=', 'movie_actor.movie_id'])
      expect(knex_join.args[2]).to.equal(['genre', 'genre.id', '=', 'movie.genre_id'])
      expect<string|number>(knex_where.firstCall.args).to.equal(['actor.id', 1])
      expect(knex_groupBy.firstCall.firstArg).to.equal('genre.name')
      expect(movies).to.equal(dummy)
    })

    it('should get the most frequent gender as the favorite actor genre', async () => {
      sandbox.stub(knex, 'select').returnsThis()
      sandbox.stub(knex, 'count').returnsThis()
      sandbox.stub(knex, 'from').returnsThis()
      sandbox.stub(knex, 'join').returnsThis()
      sandbox.stub(knex, 'where').returnsThis()
      const knex_groupBy = sandbox.stub(knex, 'groupBy')
      const dummy = [
        { gender: 'Action', frequency: 2 },
        { gender: 'Horror', frequency: 7 },
        { gender: 'Romance', frequency: 1 },
      ]
      knex_groupBy.resolves(dummy)
      expect(await findFavoriteGenre(1)).to.equal('Horror')
    })

    it('should get the most frequent gender as the favorite actor genre', async () => {
      sandbox.stub(knex, 'select').returnsThis()
      sandbox.stub(knex, 'count').returnsThis()
      sandbox.stub(knex, 'from').returnsThis()
      sandbox.stub(knex, 'join').returnsThis()
      sandbox.stub(knex, 'where').returnsThis()
      const knex_groupBy = sandbox.stub(knex, 'groupBy')
      const dummy = [
        { gender: 'Action', frequency: 2 },
        { gender: 'Romance', frequency: 1 },
        { gender: 'Mystery', frequency: 4 },
        { gender: 'Horror', frequency: 1 },
        { gender: 'Thriller', frequency: 1 }
      ]
      knex_groupBy.resolves(dummy)
      expect(await findFavoriteGenre(1)).to.equal('Mystery')
    })

    it('should return null if the actor has not participated in any movie', async () => {
      sandbox.stub(knex, 'select').returnsThis()
      sandbox.stub(knex, 'count').returnsThis()
      sandbox.stub(knex, 'from').returnsThis()
      sandbox.stub(knex, 'join').returnsThis()
      sandbox.stub(knex, 'where').returnsThis()
      const knex_groupBy = sandbox.stub(knex, 'groupBy')
      knex_groupBy.resolves([])
      expect(await findFavoriteGenre(1)).to.equal(null)
    })

  })

  describe('remove', () => {

    it('should remove row from database by id', async () => {
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      sandbox.stub(knex, 'delete').resolves(1)
      const found = await remove(1)
      expect(knex_where.firstCall.firstArg).to.equal({ id: 1 })
      expect(knex_from.firstCall.firstArg).to.equal('actor')
      expect(found).to.equal(true)
    })

    it('should indicate wether the value was in database', async () => {
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      sandbox.stub(knex, 'delete').resolves(0)
      const found = await remove(2)
      expect(knex_where.firstCall.firstArg).to.equal({ id: 2 })
      expect(knex_from.firstCall.firstArg).to.equal('actor')
      expect(found).to.equal(false)
    })

  })

  describe('update', () => {

    it('should update row from database by id', async () => {
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      const knex_update = sandbox.stub(knex, 'update').resolves(1)
      const dummy = { name: 'foo', born_at: new Date('2020-10-12T19:29:51.479Z'), bio: 'lorem' }
      const found = await update(1, dummy.name, dummy.born_at, dummy.bio)
      expect(knex_update.firstCall.firstArg).to.equal(dummy)
      expect(knex_where.firstCall.firstArg).to.equal({ id: 1 })
      expect(knex_from.firstCall.firstArg).to.equal('actor')
      expect(found).to.equal(true)
    })

    it('should indicate wether the value was found to be updated', async () => {
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      const knex_update = sandbox.stub(knex, 'update').resolves(0)
      const dummy = { name: 'foo', born_at: new Date('2020-10-12T19:29:51.479Z'), bio: 'lorem' }
      const found = await update(1, dummy.name, dummy.born_at, dummy.bio)
      expect(knex_update.firstCall.firstArg).to.equal(dummy)
      expect(knex_where.firstCall.firstArg).to.equal({ id: 1 })
      expect(knex_from.firstCall.firstArg).to.equal('actor')
      expect(found).to.equal(false)
    })

  })

  describe('find', () => {

    it('returns one row from table `actors`, by `id`', async () => {
      const dummy = {
        id: 123,
        name: 'foo',
        bio: 'lorem',
        born_at: new Date('2020-10-12T19:29:51.479Z'),
      }
      const knex_from = sandbox.stub(knex, 'from').returnsThis()
      const knex_where = sandbox.stub(knex, 'where').returnsThis()
      sandbox.stub(knex, 'first').resolves(dummy)
      const actor = await find(123)
      expect(knex_where.firstCall.firstArg).to.equal({ id: 123 })
      expect(knex_from.firstCall.firstArg).to.equal('actor')
      expect(actor).to.equal(dummy)
    })

  })
}))
