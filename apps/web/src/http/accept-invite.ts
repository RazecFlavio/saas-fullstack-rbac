import { api } from "./api-client"
export async function AcceptInvite(inviteId: string): Promise<void> { await api.get(`invites/${inviteId}/accept`) }