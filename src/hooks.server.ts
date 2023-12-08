import { SvelteKitAuth } from "@auth/sveltekit"
import Discord from "@auth/core/providers/discord"
import { CLIENT_ID, CLIENT_SECRET } from "$env/static/private"

export const handle = SvelteKitAuth({
    providers: [
        Discord({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
        })
        // {
        //     id: "discord",
        //     name: "Discord",
        //     type: "oauth",
        //     authorization: `https://discord.com/api/oauth2/authorize?scope=identify+guilds`,
        //     clientId: CLIENT_ID,
        //     clientSecret: CLIENT_SECRET,
        //     token: "https://discord.com/api/oauth2/token",
        //     userinfo: "https://discord.com/api/users/@me",
        // }
    ],
})