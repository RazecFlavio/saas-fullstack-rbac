import { api } from "./api-client"

export async function RejectInvite(inviteId: string): Promise<void> {
    await api.get(`invites/${inviteId}/reject`)

}