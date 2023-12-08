import type { PageServerLoad } from './$types'
import { connection, getID } from '$lib/mysql'

export const load: PageServerLoad = async (data) => {
    const session = await data.locals.getSession()

    let id, user

    if (session?.user) {    
        id = getID(session.user.image as string)

        user = await connection.query(`select * from haesolusers where id=?`,[id])
    }
    else {
        id = undefined
        user = undefined
    }

    const defaultChallenges = {
        getFirstSnowFlake: false,
        getFirstSanta: false,
        createTree: false,
        likeToPost: false,
        postToTree: false,
        postFiveTrees: false,
        postTenTrees: false,
        achieve250: false,
        achieve1000: false
    }

    if (user && user[0].length == 0) {
        await connection.query(`insert into haesolusers values (?,?)`,[id,0])
        await connection.query(`insert into haesolchallenges values (?,?,?)`,[id,JSON.stringify(defaultChallenges),0])
        return {user:{id,snowflake:0}}
    }

    return {
        user: user ? user[0][0] : undefined
    }
}