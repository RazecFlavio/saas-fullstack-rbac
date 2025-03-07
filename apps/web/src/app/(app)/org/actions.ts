'use server'
import { getCurrentOrg } from "@/auth/auth"
import { createOrganization } from "@/http/create-organization"
import { updateOrganization } from "@/http/update-organization"
import { HTTPError } from "ky"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z, ZodLiteral } from 'zod'

const organizationSchemma = z.object({
    name: z.string().min(4, { message: 'Please include at least 4 characteres.' }),
    domain: z.string().nullable().refine(value => {
        if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            return domainRegex.test(value)
        }
        return true;
    }, {
        message: "Please, enter a valid domain"
    }),
    shouldAttachUsersByDomain: z.union([z.literal('on'), z.literal('off'), z.boolean()]).transform(
        value => value = true || value == 'on').default(false)
}).refine(data => {
    if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
    }
    return true;
}, {
    message: 'Domain is required when auto-join is enabled.', path: ['domain']
})

export type OrganizationSchema = z.infer<typeof organizationSchemma>

export async function createOrganizationAction(data: FormData) {

    const result = organizationSchemma.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return { success: false, message: null, errors }
    }

    const { name, domain, shouldAttachUsersByDomain } = result.data

    //await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
        await createOrganization({
            name,
            domain,
            shouldAttachUsersByDomain
        })
        revalidateTag('organizations')

    } catch (error) {
        if (error instanceof HTTPError) {
            console.error(error);

            const { message } = await error.response.json()
            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Unexpected error, try again in a few minute', errors: null }
    }

    return { success: true, message: "Salvo com sucesso!", errors: null }
}

export async function updateOrganizationAction(data: FormData) {
    const currentOrg = await getCurrentOrg()

    const result = organizationSchemma.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return { success: false, message: null, errors }
    }

    const { name, domain, shouldAttachUsersByDomain } = result.data

    //await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
        await updateOrganization({
            org: currentOrg!,
            name,
            domain,
            shouldAttachUsersByDomain
        })

        revalidateTag('organizations')

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