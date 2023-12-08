import type { PageLoad } from "./$types"

export const load: PageLoad = (data) => {
    return {
        slug: data.params.slug,
        user: data.data.user as any,
        challenge: data.data.challenge as any,
        treeData: data.data.treeData as any
    }
}