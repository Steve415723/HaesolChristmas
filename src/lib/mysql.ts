import mysql from 'mysql2/promise'
import { DB_URL } from "$env/static/private"

export const connection = await mysql.createConnection(DB_URL)

export function getID(image: string) {
    const regex = new RegExp(/https:\/\/cdn.discordapp.com\/avatars\/(?<id>.+?)\/(.+?)/)

    return regex.exec(image)?.groups?.id as string
}