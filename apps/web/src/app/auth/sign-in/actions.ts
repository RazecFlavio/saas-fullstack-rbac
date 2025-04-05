'use server'
import { AcceptInvite } from "@/http/accept-invite"
import { signWithPassword } from "@/http/sign-in-with-password"
import { HTTPError } from "ky"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from 'zod'

const signInSchemma = z.object({
    email: z.string().email({ message: "Please, provide a valid e-mail address" }),
    password: z.string().min(1, { message: 'Please, provide your password' })
})

export async function signInWithEmailAndPassword(data: FormData) {

    const cookieStore = await cookies();

    const result = signInSchemma.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return { success: false, message: null, errors }
    }

    const { email, password } = result.data

    //await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
        const { token } = await signWithPassword({
            email,
            password
        })

        console.log(token)

        cookieStore.set('token', token, {
            path: '/', // significa que todas as rotas terão acesso aos cookies.
            maxAge: 60 * 60 * 24 * 7 //7 days
        })

        const inviteId = cookieStore.get('inviteId')?.value
        if (inviteId) {
            try {
                await AcceptInvite(inviteId)
                cookieStore.delete('inviteId')
            } catch (error) { console.log(error) }
        }

    } catch (error) {
        if (error instanceof HTTPError) {
            console.error(error);

            const { message } = await error.response.json()
            return { success: false, message, errors: null }
        }

        return { success: false, message: error, errors: null }
    }

    //return { success: true, message: null, errors: null }
    redirect('/')
}