import { Button } from "@/components/ui/button"
import { XOctagon } from "lucide-react"
import { revokeInviteAction } from "./actions"

interface RevokeInviteButtonProps {
    inviteId: string
}

export function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
    return (
        <form action={revokeInviteAction.bind(null, inviteId)}>
            <Button variant={'destructive'}>
                <XOctagon className="size-4 mr-2" />
                Revoke invite</Button>
        </form>
    )
}