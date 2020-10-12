import {
  ServerRoute,
  ResponseToolkit,
  Lifecycle,
  Request,
  RouteOptionsValidate,
  RouteOptionsResponseSchema,
} from '@hapi/hapi'
import { isHasCode } from '../../util/types'

import * as actors from '../../lib/actors'

import joi from 'joi'
import Boom from '@hapi/boom'

interface ParamsId {
  id: number
}

const validateParamsId: RouteOptionsValidate = {
  params: joi.object({
    id: joi.number().required().min(1),
  })
}

interface PayloadActor {
  name: string;
  born_at: Date;
  bio?: string;
}

const validatePayloadActor: RouteOptionsResponseSchema = {
  payload: joi.object({
    name: joi.string().required(),
    born_at: joi.date().required(),
    bio: joi.string(),
  })
}

export const actorRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/actors',
  handler: getAll,
}, {
  method: 'POST',
  path: '/actors',
  handler: post,
  options: { validate: validatePayloadActor },
}, {
  method: 'PUT',
  path: '/actors/{id}',
  handler: put,
  options: { validate: { ...validateParamsId, ...validatePayloadActor } },
}, {
  method: 'GET',
  path: '/actors/{id}',
  handler: get,
  options: { validate: validateParamsId },
}, {
  method: 'DELETE',
  path: '/actors/{id}',
  handler: remove,
  options: { validate: validateParamsId },
}]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return actors.list()
}


async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const payload: PayloadActor = req.payload as PayloadActor;
  const { name, born_at } = payload;
  const bio = !!payload.bio ? payload.bio : undefined;

  const id = await actors.create(name, born_at, bio);
  const result = {
    id,
    path: `${req.route.path}/${id}`
  }
  return h.response(result).code(201)
}

async function put(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const params = req.params as ParamsId;
  const { id } = params;
  const payload: PayloadActor = req.payload as PayloadActor;
  const { name, born_at } = payload;
  const bio = !!payload.bio ? payload.bio : undefined;

  if (await actors.update(
    id, name, born_at, bio,
  )) {
    return h.response().code(204)
  } else {
    return Boom.notFound()
  }
}

async function get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await actors.find(id)
  return found || Boom.notFound()
}

async function remove(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  try {
    if (await actors.remove(id)) {
      return h.response().code(204)
    } else {
      return Boom.notFound()
    }
  }
  catch (er: unknown) {
    if (isHasCode(er) && er.code.includes('ER_ROW_IS_REFERENCED')) {
      return Boom.badRequest(`actor has related movies`)
    } else {
      throw er;
    }
  }
}
