'use server'

import { getCurrentOrg } from "@/auth/auth";
import { removeMember } from "@/http/remove-member";
import { RevokeInvite } from "@/http/revoke-invite";
import { updateMemberRole } from "@/http/update-member-role";
import { Role } from "@saas/auth";
import { revalidateTag } from "next/cache";

export async function removeMemberAction(memberId: string) {
    const currentOrg = await getCurrentOrg()

    await removeMember({ org: currentOrg!, memberId })

    revalidateTag(`${currentOrg!}-members`)
}

export async function updateMemberRoleAction(memberId: string, role: Role) {
    const currentOrg = await getCurrentOrg()

    await updateMemberRole({ org: currentOrg!, memberId, role })

    revalidateTag(`${currentOrg!}-members`)
}

export async function revokeInviteAction(inviteId: string) {
    const currentOrg = await getCurrentOrg()

    await RevokeInvite({ org: currentOrg!, inviteId })

    revalidateTag(`${currentOrg!}-invites`)
}