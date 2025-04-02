'use client'

import { Check, UserPlus2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPendingInvites } from "@/http/get-pending-invites";
import { useState } from "react";
import { acceptInviteAction, rejectInviteAction } from "./action";

dayjs.extend(relativeTime)

export function PendingInvites() {
    const [isOpen, setIsOpen] = useState(false)

    const { data } = useQuery({
        queryKey: ['pending-invites'],
        queryFn: GetPendingInvites,
        enabled: isOpen
    }) //utilizado para client side

    const queryClient = useQueryClient()

    async function handleAcceptInvite(inviteId: string) {
        await acceptInviteAction(inviteId)
        queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
    }
    async function handleRejectInvite(inviteId: string) {
        await rejectInviteAction(inviteId)
        queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
    }



    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                    <UserPlus2 className="size-4" />
                    <span className="sr-only">Pending invites</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-2">
                <span className="block text-sm font-medium">Pending invites ({data?.invites.length ?? 0})</span>

                {data?.invites.map(invite => {
                    return (
                        <div className="space-y-2" key={invite.id}>
                            <p className="text-center leading-relaxed text-muted-foreground">
                                <span className="font-medium text-foreground">{invite.author?.name ?? 'Someone '}</span> invited you to join {' '}
                                <span className="font-medium text-foreground">{invite.organization.name}</span>.{' '}
                                {dayjs(invite.createdAt).fromNow()}
                            </p>
                            <div className="flex gap-1 justify-end">
                                <Button onClick={() => { handleAcceptInvite(invite.id) }} size={'xs'} variant={'outline'}>
                                    <Check className="size-3 mr-1.5" />
                                    Accept</Button>
                                <Button onClick={() => { handleRejectInvite(invite.id) }} size={'xs'} variant={'ghost'} className="text-muted-foreground">
                                    <X className="size-3 mr-1.5" />
                                    Reject</Button>
                            </div>
                        </div>
                    )
                })}
            </PopoverContent>
        </Popover>
    )
}