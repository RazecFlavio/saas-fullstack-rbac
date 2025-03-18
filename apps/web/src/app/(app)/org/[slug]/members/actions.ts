'use server'

import { getCurrentOrg } from "@/auth/auth";
import { removeMember } from "@/http/remove-member";
import { updateMemberRole } from "@/http/update-member-role";
import { Role } from "@saas/auth";
import { revalidateTag } from "next/cache";

async function revalidate({ org, tag }: { org: string, tag?: string }) {
    if (!tag)
        revalidateTag(`${org!}-members`)
    else
        revalidateTag(tag)
}

export async function removeMemberAction(memberId: string) {
    const currentOrg = await getCurrentOrg()

    await removeMember({ org: currentOrg!, memberId })

    revalidate({ org: currentOrg! })
}

export async function updateMemberRoleAction(memberId: string, role: Role) {
    const currentOrg = await getCurrentOrg()

    await updateMemberRole({ org: currentOrg!, memberId, role })

    revalidate({ org: currentOrg! })
}
