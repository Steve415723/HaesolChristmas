import type { RequestHandler } from './$types'
import { connection, getID } from '$lib/mysql'

export const POST: RequestHandler = async (data) => {
    const session = await data.locals.getSession()

    if (!session?.user) {
        return Response.json({succeed:false,message:"로그인이 필요한 서비스입니다."},{status:401})
    }

    if (!data.request.body) {
        return Response.json({succeed:false,message:"필수 인자가 누락되었습니다."},{status:400})
    }

    const body: {targetid: string,content: string,name: string,index: number} = await data.request.json()
    const id = getID(session.user.image as string)

    if (body.targetid == id) {
        return Response.json({succeed:false,message:"자기 자신의 트리에는 선물할 수 없습니다.\n선물이 없어서 많이 외로우셨나요?"})
    }

    const posts = await connection.query(`select * from haesoltrees where id=?`,[body.targetid])

    if (posts[0].length == 0) {
        return Response.json({succeed:false,message:"존재하지 않는 트리입니다.\n혹시 유령의 트리를 찾으셨나요?"},{status:400})
    }

    const messages: {id: string,name: string,content: string,index: number,rotate: number}[] = JSON.parse(posts[0][0].messages)

    if (messages.findIndex((value) => value.id == id) != -1) {
        return Response.json({succeed:false,message:"이미 선물을 등록한 트리입니다."},{status:400})
    }

    messages.push({id,name:body.name,content:body.content,index:body.index,rotate:Math.floor(Math.random() * 31) - 15})

    await connection.query(`update haesoltrees set messages=? where id=?`,[JSON.stringify(messages),body.targetid])

    return Response.json({succeed:true,message:"성공적으로 선물을 추가했습니다."},{status:200})
}