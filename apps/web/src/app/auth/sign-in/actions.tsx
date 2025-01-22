'use server'
import { signWithPassword } from "@/http/sign-in-with-password"
import { HTTPError } from "ky"
import { z } from 'zod'

const signInSchemma = z.object({
    email: z.string().email({ message: "Please, provide a valid e-mail address" }),
    password: z.string().min(1, { message: 'Please, provide your password' })
})

export async function signInWithEmailAndPassword(data: FormData) {

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
    } catch (error) {
        if (error instanceof HTTPError) {
            console.error(error);

            const { message } = await error.response.json()
            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Unexpected error, try again in a few minute', errors: null }
    }

    return { success: true, message: null, errors: null }
}