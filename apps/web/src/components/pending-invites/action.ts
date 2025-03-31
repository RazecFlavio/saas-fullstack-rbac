'use server'

import { AcceptInvite } from "@/http/accept-invite";
import { RejectInvite } from "@/http/reject-invite";
import { revalidateTag } from "next/cache";

export async function acceptInviteAction(inviteid: string) {
    await AcceptInvite(inviteid)

    revalidateTag('organizations')

}

export async function rejectInviteAction(inviteid: string) {
    await RejectInvite(inviteid)

    revalidateTag('organizations')

}