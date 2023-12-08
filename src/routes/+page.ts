import type { PageLoad } from "./$types"

export const load: PageLoad = (data) => {
    return {
        user: data.data.user as any,
        challenge: data.data.challenge as any,
        hasTree: data.data.hasTree
    }
}