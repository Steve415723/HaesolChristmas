import type { RequestHandler } from './$types'
import { connection, getID } from '$lib/mysql'

export const POST: RequestHandler = async (data) => {
    const session = await data.locals.getSession()

    if (!session?.user) {
        return Response.json({message:"로그인이 필요한 서비스입니다."},{status:401})
    }

    if (!data.request.body) {
        return Response.json({message:"필수 인자가 누락되었습니다."},{status:400})
    }

    const body: {type:"snowflake" | "challenge" | "postcount" | "treepost",newValue: any} = await data.request.json()
    const id = getID(session.user.image as string)

    if (body.type == "snowflake") {
        await connection.query(`update haesolusers set snowflake=? where id=?`,[Math.min(body.newValue,1000),id])
    }
    else if (body.type == "challenge") {
        await connection.query(`update haesolchallenges set challenges=? where id=?`,[JSON.stringify(body.newValue),id])
    }
    else if (body.type == "postcount") {
        await connection.query(`update haesolchallenges set postcount = postcount + 1 where id=?`,[id])
    }
    else {
        await connection.query(`update haesoltrees set post = ? where id=?`,[body.newValue,id])
    }

    return new Response(undefined,{status:204})
}