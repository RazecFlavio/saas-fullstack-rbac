import { Role } from "@saas/auth";
import { api } from "./api-client"

interface GetMembersResponse {
    members: {
        name: string | null;
        id: string;
        avatarUrl: string | null;
        role: Role;
        userId: string;
        email: string;
    }[]
}

export async function getMembers(org: string) {
    //await new Promise(resolve => setTimeout(resolve, 2000))

    const result = await api.get(`organizations/${org}/members`).json<GetMembersResponse>()
    return result
}