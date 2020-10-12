import {
  ServerRoute,
  ResponseToolkit,
  Lifecycle,
  Request,
  RouteOptionsValidate,
  RouteOptionsResponseSchema,
} from '@hapi/hapi'

import * as movies from '../../lib/movies'
import joi from 'joi'
import Boom from '@hapi/boom'
import { isHasCode } from '../../util/types'

interface ParamsId {
  id: number
}

const validateParamsId: RouteOptionsValidate = {
  params: joi.object({
    id: joi.number().required().min(1),
  })
}

interface PayloadMovies {
  name: string;
  synopsis?: string;
  released_at: Date;
  runtime: number;
  genre_id: number;
}

const validatePayloadMovie: RouteOptionsResponseSchema = {
  payload: joi.object({
    name: joi.string().required(),
    synopsis: joi.string(),
    released_at: joi.date().required(),
    runtime: joi.number().required(),
    genre_id: joi.number().required().min(1),
  })
}

export const movieRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/movies',
  handler: getAll,
}, {
  method: 'POST',
  path: '/movies',
  handler: post,
  options: { validate: validatePayloadMovie },
},{
  method: 'PUT',
  path: '/movies/{id}',
  handler: put,
  options: { validate: {...validateParamsId, ...validatePayloadMovie} },
},{
  method: 'GET',
  path: '/movies/{id}',
  handler: get,
  options: { validate: validateParamsId },
},{
  method: 'DELETE',
  path: '/movies/{id}',
  handler: remove,
  options: { validate: validateParamsId },
}]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return movies.list()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const payload: PayloadMovies = req.payload as PayloadMovies;
  const { name, released_at, runtime, genre_id } = payload;
  const synopsis = !!payload.synopsis ? payload.synopsis : undefined;

  try {
    const id = await movies.create(name, released_at, runtime, genre_id, synopsis)
    const result = {
      id,
      path: `${req.route.path}/${id}`
    }
    return h.response(result).code(201)
  }
  catch (er: unknown) {
    if(isHasCode(er) && er.code.includes('ER_NO_REFERENCED_ROW')) {
      return Boom.badRequest(`related genre does not exists`)
    } else {
      throw er;
    }
  }
}

async function put(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const params = req.params as ParamsId;
  const { id } = params;
  const payload: PayloadMovies = req.payload as PayloadMovies;
  const { name, released_at, runtime, genre_id } = payload;
  const synopsis = !!payload.synopsis ? payload.synopsis : undefined;

  try {
    if (await movies.update(
      id, name, released_at, runtime, genre_id, synopsis
    )) {
      return h.response().code(204)
    } else {
      return Boom.notFound()
    }
  }
  catch(er: unknown){
    if(isHasCode(er) && er.code.includes('ER_NO_REFERENCED_ROW')) {
      return Boom.badRequest(`related genre does not exists`)
    } else {
      throw er;
    }
  }
}

async function get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await movies.find(id)
  return found || Boom.notFound()
}

async function remove(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  try {
    if (await movies.remove(id)) {
      return h.response().code(204)
    } else {
      return Boom.notFound()
    }
  }
  catch(er: unknown){
    if(isHasCode(er) && er.code.includes('ER_ROW_IS_REFERENCED')) {
      return Boom.badRequest(`movie has related actors`)
    } else {
      throw er;
    }
  }
}
