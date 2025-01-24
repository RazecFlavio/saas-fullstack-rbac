'use server'
import { signWithPassword } from "@/http/sign-in-with-password"
import { signUp } from "@/http/sign-up"
import { HTTPError } from "ky"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from 'zod'

const signUpSchemma = z.object({
    name: z.string().refine(value => value.split(' ').length > 1, {
        message: 'Please, enter your full name'
    }),
    email: z.string().email({ message: "Please, provide a valid e-mail address" }),
    password: z.string().min(6,
        { message: 'Password should have at least 6 characteres.' }
    ),
    password_confirmation: z.string()
}).refine(data => data.password === data.password_confirmation, {
    message: 'Passoword is not equal',
    path: ['password_confirmation']
})

export async function signUpAction(data: FormData) {

    const result = signUpSchemma.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return { success: false, message: null, errors }
    }

    const { name, email, password } = result.data

    //await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
        await signUp({
            name,
            email,
            password
        })

    } catch (error) {
        if (error instanceof HTTPError) {
            console.error(error);

            const { message } = await error.response.json()
            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Unexpected error, try again in a few minute', errors: null }
    }

    //return { success: true, message: null, errors: null }
    redirect('/')
}