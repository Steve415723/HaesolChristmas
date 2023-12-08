import type { RequestHandler } from './$types'
import { connection, getID } from '$lib/mysql'

export const POST: RequestHandler = async (data) => {
    const session = await data.locals.getSession()

    if (!session?.user) {
        return Response.json({message:"로그인이 필요한 서비스입니다."},{status:401})
    }

    const id = getID(session.user.image as string)

    await connection.query(`insert into haesoltrees values (?,?,?,?,?,?)`,[id,session.user.name,"",0,"[]","[]"])

    return Response.json({location:`/trees/${id}`})
}