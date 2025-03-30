import { AcceptInvite } from "@/http/accept-invite";
import { signWithGithub } from "@/http/sign-in-with-github";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.json({
            message: 'Github OAuth code was not found.'
        }, {
            status: 400
        }
        )
    }

    const { token } = await signWithGithub({ code })

    cookieStore.set('token', token, {
        path: '/', // significa que todas as rotas terão acesso aos cookies.
        maxAge: 60 * 60 * 24 * 7 //7 days
    })

    const inviteId = cookieStore.get('inviteId')?.value
    if (inviteId) {
        try {
            await AcceptInvite(inviteId)
            cookieStore.delete('inviteId')
        } catch { }
    }

    const redirectURL = req.nextUrl.clone()
    redirectURL.pathname = '/'
    redirectURL.search = ''

    return NextResponse.redirect(redirectURL)

}