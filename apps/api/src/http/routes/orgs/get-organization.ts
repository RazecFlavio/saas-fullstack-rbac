import { auth } from "@/http/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";


export async function getOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug', {
        schema: {
            tags: ['Organizations'],
            summary: 'Get details from Organization',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string()
            }),
            response: {
                200: z.object({
                    organization: z.object({
                        name: z.string(),
                        id: z.string().uuid(),
                        slug: z.string(),
                        domain: z.string().nullable(),
                        shouldAttachUsersByDomains: z.boolean(),
                        avatarUrl: z.string().url().nullable(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                        ownerId: z.string().uuid()
                    })
                })
            }
        }
    }, async (req) => {
        const { slug } = req.params;
        const { organization } = await req.getUserMembership(slug);

        return {
            organization
        }
    })
}