import { auth, isAuthenticated } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AcceptInvite } from "@/http/accept-invite";
import { getInvite } from "@/http/get-invite"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircle, LogIn } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

dayjs.extend(relativeTime)

interface InvitePageProps {
    params: {
        id: string
    }
}

export default async function InvitePage({ params }: InvitePageProps) {
    const inviteId = params.id

    const { invite } = await getInvite(inviteId);
    const isUserAuthenticated = await isAuthenticated();
    let currentEmail = null;

    if (isUserAuthenticated) {
        const user = await auth()
        currentEmail = user?.email
    }

    const userIsAuthenticatedWithSameEmailFromInvite = currentEmail === invite.email

    async function signInFromInvite() {
        'use server'
        const cookieStore = await cookies();

        cookieStore.set('inviteId', inviteId)
        redirect(`/auth/sign-in?email=${invite.email}`)
    }


    async function acceptInviteAction() {
        'use server'

        await AcceptInvite(inviteId)

        redirect('/')
    }


    //return <pre>{JSON.stringify(invite, null, 2)}</pre>
    return (
        <div className="min-h-screen flex items-center justify-center flex-col px-4">
            <div className="w-full max-w-sm space-y-6 flex flex-col justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="size-16">
                        {invite.author?.avatarurl && (
                            <AvatarImage src={invite.author.avatarurl} />
                        )}
                        <AvatarFallback />
                    </Avatar>

                    <p className="text-center leading-relaxed text-muted-foreground text-balance">
                        <span className="font-medium text-foreground">{invite.author?.name ?? 'Someone '}</span> invited you to join {' '}
                        <span className="font-medium text-foreground">{invite.organization.name}</span>.{' '}
                        {dayjs(invite.createdAt).fromNow()}
                    </p>
                </div>
                <Separator />

                {!isUserAuthenticated && (
                    <form action={signInFromInvite}>
                        <Button type="submit" variant={'secondary'} className="w-full">
                            <LogIn className="size-4 mr-2" />
                            Sign in to accept the invite
                        </Button>
                    </form>
                )}

                {userIsAuthenticatedWithSameEmailFromInvite && (
                    <form action={acceptInviteAction}>
                        <Button type="submit" variant={'secondary'} className="w-full">
                            <CheckCircle className="size-4 mr-2" />
                            Join {invite.organization.name}
                        </Button>
                    </form>
                )}

            </div>
        </div>
    )
}