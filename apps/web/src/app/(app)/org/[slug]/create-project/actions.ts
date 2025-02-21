'use server'
import { getCurrentOrg } from "@/auth/auth"
import { createProject } from "@/http/create-project"
import { HTTPError } from "ky"
import { z } from 'zod'

const projectSchemma = z.object({
    name: z.string().min(4, { message: 'Please include at least 4 characteres.' }),
    description: z.string()
})

export async function createProjectAction(data: FormData) {

    const result = projectSchemma.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return { success: false, message: null, errors }
    }

    const { name, description } = result.data

    //await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
        await createProject({
            org: await getCurrentOrg() as string,
            name,
            description
        })

    } catch (error) {
        if (error instanceof HTTPError) {
            console.error(error);

            const { message } = await error.response.json()
            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Unexpected error, try again in a few minute', errors: null }
    }

    return { success: true, message: "Salvo com sucesso!", errors: null }
    //redirect('/')
}