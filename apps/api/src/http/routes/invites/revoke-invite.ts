import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_erros/bad-request-error";

export async function revokeInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .post('/organizations/:slug/invites/:inviteId', {
            schema: {
                tags: ['Invites'],
                summary: 'Revoke an Invite',
                security: [{ bearerAuth: [] }],
                params: z.object({
                    slug: z.string(),
                    inviteId: z.string().uuid()
                })
                ,
                response: {
                    204: z.null()
                }
            }
        }, async (req, reply) => {
            const { slug, inviteId } = req.params;
            const userId = await req.getCurrentUserId()
            const { membership, organization } = await req.getUserMembership(slug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('delete', 'Invite')) throw new UnauthorizedError(`You're not allowed to delete an invite.`)


            const invite = await prisma.invite.findUnique({
                where: {
                    id: inviteId,
                    organizationId: organization.id
                }
            })

            if (!invite) {
                throw new BadRequestError('Invite not found.')
            }

            await prisma.invite.delete({
                where: {
                    id: invite.id
                }
            })

            return reply.status(204).send()
        })
}