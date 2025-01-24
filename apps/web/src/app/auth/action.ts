'use server'

import { redirect } from "next/navigation"

export async function signWithGithub() {
    const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')
    githubSignInURL.searchParams.set('client_id', 'Ov23liSnM4eAEx91a5if')
    githubSignInURL.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback')
    githubSignInURL.searchParams.set('scope', 'user')

    console.log('URL:', githubSignInURL.toString())

    redirect(githubSignInURL.toString())
}