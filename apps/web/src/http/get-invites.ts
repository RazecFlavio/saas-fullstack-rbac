import { Role } from "@saas/auth";
import { api } from "./api-client"

interface GetInvitesResponse {
    invites: {
        id: string;
        createdAt: Date;
        role: Role
        email: string;
        author: {
            name: string | null;
            id: string;
        } | null;
    }[]
}

export async function getInvites(org: string) {
    //await new Promise(resolve => setTimeout(resolve, 2000))

    const result = await api.get(`organizations/${org}/invites`).json<GetInvitesResponse>()
    return result
}