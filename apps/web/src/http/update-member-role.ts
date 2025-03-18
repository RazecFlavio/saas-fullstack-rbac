import { Role } from "@saas/auth"
import { api } from "./api-client"

interface UpdateMemberRoleRequest {
    org: string
    memberId: string
    role: Role
}

export async function updateMemberRole({
    org, memberId, role }: UpdateMemberRoleRequest
) {
    await api.put(`organizations/${org}/members/${memberId}`, {
        json: { role }
    })
}