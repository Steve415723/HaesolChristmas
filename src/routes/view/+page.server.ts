import type { PageServerLoad } from './$types'
import { connection } from '$lib/mysql'

export const load: PageServerLoad = async () => {
    const trees = await connection.query(`select id, name from haesoltrees;`)

    return {trees: trees[0]}
}