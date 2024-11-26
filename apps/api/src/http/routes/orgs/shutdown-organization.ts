import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { organizationSchema } from "@saas/auth";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

export async function shutdownOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organizations/:slug', {
        schema: {
            tags: ['Organizations'],
            summary: 'Shutdown organization ',
            security: [{ bearerAuth: [] }],
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


        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authOrganization)) throw new UnauthorizedError(`You're not allowed to shutdown this organization`);


        await prisma.organization.delete({
            where: {
                id: organization.id
            }
        })
        return reply.status(204).send()

    })
}