import { knex } from '../util/knex'

export async function check(): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {}
  result['db'] = await checkDb()
  result['http'] = true
  return result
}

async function checkDb(): Promise<boolean> {
  try {
    await knex.raw('SELECT 1 FROM dual;')
    return true
  } catch(er) {
    console.log(er)
    return false
  }
}
