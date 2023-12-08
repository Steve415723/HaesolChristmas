import type { RequestHandler } from './$types'
import { connection, getID } from '$lib/mysql'

export const POST: RequestHandler = async (data) => {
    const session = await data.locals.getSession()

    if (!session?.user) {
        return Response.json({message:"로그인이 필요한 서비스입니다."},{status:401})
    }

    const id = getID(session.user.image as string)

    const body: {value: string} = await data.request.json()

    const result = await connection.query(`select * from haesolrewards where author=? and reward=?`,[id,body.value])

    if (result[0].length == 0) {
        const rewardID = crypto.randomUUID()
    
        await connection.query(`insert into haesolrewards values (?,?,?)`,[id,body.value,rewardID])
    
        return Response.json({message:rewardID})
    }
    else return Response.json({message:result[0][0].id})
}