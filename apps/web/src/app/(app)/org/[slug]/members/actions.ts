'use server'

import { getCurrentOrg } from "@/auth/auth";
import { CreateInvite } from "@/http/create-invite";
import { removeMember } from "@/http/remove-member";
import { RevokeInvite } from "@/http/revoke-invite";
import { updateMemberRole } from "@/http/update-member-role";
import { Role, roleSchema } from "@saas/auth";
import { HTTPError } from "ky";
import { revalidateTag } from "next/cache";
import { z } from "zod";
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

const inviteSchemma = z.object({
    email: z.string().email({ message: "Invalid e-mail address" }),
    role: roleSchema
})

export async function createInviteAction(data: FormData) {
    const currentOrg = await getCurrentOrg()

    const result = inviteSchemma.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return { success: false, message: null, errors }
    }

    const { email, role } = result.data

    //await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
        await CreateInvite({
            org: currentOrg!,
            email, role
        })

        revalidateTag(`${currentOrg!}-invites`)

    } catch (error) {
        if (error instanceof HTTPError) {
            console.error(error);

            const { message } = await error.response.json()
            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Unexpected error, try again in a few minute', errors: null }
    }

    return { success: true, message: "Invite criado com sucesso!", errors: null }
    //redirect('/')
}