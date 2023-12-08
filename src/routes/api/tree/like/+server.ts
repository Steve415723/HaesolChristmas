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

    const body: {targetid: string} = await data.request.json()
    const id = getID(session.user.image as string)

    if (body.targetid == id) return Response.json({message:"자기 자신의 트리에는 추천할 수 없습니다.\n근데 클라이언트쪽 감지를 뚫으셨네...?"},{status:400})

    const likeusersQuery = await connection.query(`select * from haesoltrees where id=?`,[body.targetid])

    const likeusers = JSON.parse(likeusersQuery[0][0].likeusers)

    if (likeusers.includes(id)) return Response.json({message:"이미 좋아요를 누른 메시지입니다."})

    likeusers.push(id)

    await connection.query(`update haesoltrees set \`like\` = \`like\` + 1, likeusers=? where id=?`,[JSON.stringify(likeusers),body.targetid])

    return new Response(undefined,{status:204})
}