import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { roleSchema } from "@saas/auth";

export async function updateMember(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .put('/organization/:slug/members/:memberId'
            , {
                schema: {
                    tags: ['Members'],
                    summary: 'Update a member.',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                        memberId: z.string().uuid()
                    }),
                    body: z.object({
                        role: roleSchema
                    }),
                    response: {
                        204: z.null()
                    }
                }
            }, async (req, reply) => {
                const { slug, memberId } = req.params;
                const userId = await req.getCurrentUserId()

                const { membership, organization } =
                    await req.getUserMembership(slug)

                const { cannot } = getUserPermissions(userId, membership.role)

                if (cannot('update', 'User'))
                    throw new UnauthorizedError(`You're not allowed to update this member.`)

                const { role } = req.body;

                await prisma.member.update({
                    where: {
                        id: memberId,
                        organizationId: organization.id
                    },
                    data: {
                        role
                    }
                })


                return reply.status(204).send()

            })
}