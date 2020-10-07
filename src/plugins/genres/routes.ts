import {
  ServerRoute,
  ResponseToolkit,
  Lifecycle,
  RouteOptionsValidate,
  Request,
  RouteOptionsResponseSchema
} from '@hapi/hapi'
import joi from 'joi'
import Boom from '@hapi/boom'

import * as genres from '../../lib/genres'
import { isHasCode } from '../../util/types'


interface ParamsId {
  id: number
}
const validateParamsId: RouteOptionsValidate = {
  params: joi.object({
    id: joi.number().required().min(1),
  })
}

interface PayloadGenre {
  name: string
}
const validatePayloadGenre: RouteOptionsResponseSchema = {
  payload: joi.object({
    name: joi.string().required(),
  })
}


export const genreRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/genres',
  handler: getAll,
},{
  method: 'POST',
  path: '/genres',
  handler: post,
  options: { validate: validatePayloadGenre },
},{
  method: 'GET',
  path: '/genres/{id}',
  handler: get,
  options: { validate: validateParamsId },
},{
  method: 'PUT',
  path: '/genres/{id}',
  handler: put,
  options: { validate: {...validateParamsId, ...validatePayloadGenre} },
},{
  method: 'DELETE',
  path: '/genres/{id}',
  handler: remove,
  options: { validate: validateParamsId },
},]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return genres.list()
}

async function get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await genres.find(id)
  return found || Boom.notFound()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { name } = (req.payload as PayloadGenre)

  try {
    const id = await genres.create(name)
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

async function put(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)
  const { name } = (req.payload as PayloadGenre)

  try {
    return await genres.update(id, name) ? h.response().code(204) : Boom.notFound()
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}

async function remove(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  return await genres.remove(id) ? h.response().code(204) : Boom.notFound()
}
