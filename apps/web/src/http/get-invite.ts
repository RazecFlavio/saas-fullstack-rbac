import { Role } from "@saas/auth";
import { api } from "./api-client"

interface GetInviteResponse {
    invite: {
        id: string;
        createdAt: Date;
        role: Role
        email: string;
        organization: {
            name: string
        }
        author: {
            name: string | null;
            id: string;
            avatarurl: string | null
        } | null;
    }
}

export async function getInvite(inviteId: string) {
    const result = await api.get(`invites/${inviteId}`).json<GetInviteResponse>()
    return result
}