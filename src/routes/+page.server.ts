import type { PageServerLoad } from './$types'
import { connection, getID } from '$lib/mysql'

export const load: PageServerLoad = async (data) => {
    const session = await data.locals.getSession()

    let id, user, challenge

    if (session?.user) {    
        id = getID(session.user.image as string)

        user = await connection.query(`select * from haesolusers where id=?`,[id])
        challenge = await connection.query(`select * from haesolchallenges where id=?`,[id])
    }
    else {
        id = undefined
        challenge = undefined
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
        return {user:{id,snowflake:0},challenge:defaultChallenges,hasTree:false}
    }

    let tree = undefined

    if (id) tree = await connection.query(`select * from haesoltrees where id=?`,[id])

    return {
        user: user ? user[0][0] : undefined,
        challenge: challenge ? challenge[0][0] : {challenges:JSON.stringify(defaultChallenges)},
        hasTree: user ? tree[0].length > 0 : false
    }
}