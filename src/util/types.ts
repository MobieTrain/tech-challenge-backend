import { ResponseObject } from "@hapi/hapi"

export interface HasCode {
  code: string
}

export function isHasCode(value: unknown): value is HasCode {
  if(!value || typeof value !== 'object') return false
  const safe = value as Record<string, unknown>
  return !!safe.code
}

export function isResponseObject(value: unknown): value is ResponseObject {
  if(!value || typeof value !== 'object') return false
  const safe = value as Record<string, unknown>
  return !!safe.statusCode
}
