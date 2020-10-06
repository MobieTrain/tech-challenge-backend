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

import { find, list, remove, create, update } from '../../lib/genre'


interface ParamsId {
	id: number
}
const validateParamsId: RouteOptionsValidate = {
	params: {
		id: joi.number().required().min(1),
	}
}

interface GenrePayload {
	name: string
}
const validateGenrePayload: RouteOptionsResponseSchema = {
	payload: {
		name: joi.string().required(),
	}
}


export const genreRoutes: ServerRoute[] = [{
	method: 'GET',
	path: '/genre',
	handler: _getAll,
},{
	method: 'POST',
	path: '/genre',
	handler: _post,
	options: { validate: validateGenrePayload },
},{
	method: 'GET',
	path: '/genre/{id}',
	handler: _get,
	options: { validate: validateParamsId },
},{
	method: 'PUT',
	path: '/genre/{id}',
	handler: _put,
	options: { validate: {...validateParamsId, ...validateGenrePayload} },
},{
	method: 'DELETE',
	path: '/genre/{id}',
	handler: _delete,
	options: { validate: validateParamsId },
},]


async function _getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
	return list()
}

async function _get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
	const { id } = (req.params as ParamsId)

	const found = await find(id)
	return found || Boom.notFound()
}

async function _post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
	const { name } = (req.payload as GenrePayload)

	try {
		const id = await create(name)
		const result = {
			id,
			path: `${req.route.path}/${id}`
		}
		return h.response(result).code(201)
	}
	catch(er){
		if(er['code'] = 'ER_DUP_ENTRY') return Boom.conflict()
		else throw er
	}
}

async function _put(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
	const { id } = (req.params as ParamsId)
	const { name } = (req.payload as GenrePayload)

	try {
		return await update(id, name) ? h.response().code(204) : Boom.notFound()
	}
	catch(er){
		if(er['code'] = 'ER_DUP_ENTRY') return Boom.conflict()
		else throw er
	}

}

async function _delete(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
	const { id } = (req.params as ParamsId)

	return await remove(id) ? h.response().code(204) : Boom.notFound()
}
