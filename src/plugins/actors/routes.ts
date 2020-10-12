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

import * as actors from '../../lib/actors'
import { isHasCode } from '../../util/types'

interface ParamsId {
  id: number
}
const validateParamsId: RouteOptionsValidate = {
  params: joi.object({
    id: joi.number().required().min(1),
  })
}

interface PayloadActor {
  name: string
  bio: string
  born_at: Date
}

interface PayloadCast {
  actor_id: number
  movie_id: number
  character_name: string
}

const validatePayloadActor: RouteOptionsResponseSchema = {
  payload: joi.object({
    name: joi.string().required(),
    bio: joi.string().required(),
    born_at: joi.date().required(),
  })
}

const validatePayloadActorCharacter: RouteOptionsResponseSchema = {
  payload: joi.object({
    movie_id: joi.number().required(),
    character_name: joi.string().required()
  })
}


export const actorRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/actors',
  handler: getAll,
},{
  method: 'POST',
  path: '/actors',
  handler: post,
  options: { validate: validatePayloadActor },
},{
  method: 'POST',
  path: '/actors/{id}/characters',
  handler: createCharacter,
  options: { validate: {...validateParamsId, ...validatePayloadActorCharacter} },
},{
  method: 'GET',
  path: '/actors/{id}',
  handler: get,
  options: { validate: validateParamsId },
},{
  method: 'PUT',
  path: '/actors/{id}',
  handler: put,
  options: { validate: {...validateParamsId, ...validatePayloadActor} },
},{
  method: 'DELETE',
  path: '/actors/{id}',
  handler: remove,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actors/{id}/characters',
  handler: getAllCharacters,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actors/{id}/movies',
  handler: getAllMovies,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actors/{id}/genre/favourite',
  handler: getFavouriteGenre,
  options: { validate: validateParamsId },
},]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return actors.list()
}

async function get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await actors.find(id)
  return found || Boom.notFound()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { name, bio, born_at } = (req.payload as PayloadActor)

  try {
    const id = await actors.create(name, bio, born_at)
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

async function createCharacter(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)
  const { movie_id, character_name } = (req.payload as PayloadCast)

  try {
    const characterId = await actors.createCharacter(id, movie_id, character_name)
    const result = {
      id: characterId,
      path: `/actors/${id}/characters/${characterId}`
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
  const { name, bio, born_at } = (req.payload as PayloadActor)

  try {
    return await actors.update(id, name, bio, born_at) ? h.response().code(204) : Boom.notFound()
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}

async function remove(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  return await actors.remove(id) ? h.response().code(204) : Boom.notFound()
}

async function getAllCharacters(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)
  return actors.characters(id)
}

async function getAllMovies(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)
  return actors.movies(id)
}

async function getFavouriteGenre(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  try {
    const {id} = (req.params as ParamsId)
    return actors.favouriteGenre(id)
  } catch(er: unknown){
    console.log(er)
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.notFound()
  }
}
