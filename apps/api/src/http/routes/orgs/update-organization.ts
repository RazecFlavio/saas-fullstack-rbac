import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_erros/bad-request-error";
import { organizationSchema } from "@saas/auth";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

export async function updateOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organizations/:slug', {
        schema: {
            tags: ['Organizations'],
            summary: 'Update organization details',
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string(),
                domain: z.string().nullish(),
                shouldAttachUsersByDomains: z.boolean().optional()
            }),
            params: z.object({
                slug: z.string()
            }),
            response: {
                204: z.null()
            }
        }
    }, async (req, reply) => {
        const { slug } = req.params;

        const userId = await req.getCurrentUserId()
        const { membership, organization } = await req.getUserMembership(slug);

        const { name, domain, shouldAttachUsersByDomains } = req.body;

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) throw new UnauthorizedError(`You're not allowed to update this organization`);

        if (domain) {
            const organizationByDomain = await prisma.organization.findFirst({
                where: {
                    domain, id: { not: organization.id }
                }
            })
            if (organizationByDomain) throw new BadRequestError('Another organization with same domain already exists');
        }

        await prisma.organization.update({
            where: {
                id: organization.id
            },
            data: {
                name,
                // slug: createSlug(name),
                domain,
                shouldAttachUsersByDomains,
                // ownerId: userId,                
            }
        })
        return reply.status(204).send()

    })
}