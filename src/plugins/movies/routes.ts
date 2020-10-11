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
    genre_id: joi.number().required(),
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
}]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return movies.list()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const input: PayloadMovies = req.payload as PayloadMovies;
  const { name, released_at, runtime, genre_id } = input;
  const synopsis = !!input.synopsis ? input.synopsis : undefined;

  try {
    const id = await movies.create(name, released_at, runtime, genre_id, synopsis)
    const result = {
      id,
      path: `${req.route.path}/${id}`
    }
    return h.response(result).code(201)
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}