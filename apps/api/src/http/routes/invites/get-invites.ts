import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_erros/bad-request-error";

export async function getInvites(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .post('/organizations/:slug/invites', {
            schema: {
                tags: ['Invites'],
                summary: 'Get all organization Invites',
                security: [{ bearerAuth: [] }],
                params: z.object({
                    slug: z.string()
                })
                ,
                response: {
                    200: z.object({
                        invites: z.array(
                            z.object({
                                id: z.string().uuid(),
                                createdAt: z.date(),
                                role: roleSchema,
                                email: z.string().email(),
                                author: z.object(
                                    {
                                        name: z.string().nullable(),
                                        id: z.string().uuid(),
                                    }
                                ).nullable()
                            }))
                    })
                }
            }
        }, async (req, reply) => {
            const { slug } = req.params;
            const userId = await req.getCurrentUserId()
            const { membership, organization } = await req.getUserMembership(slug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('get', 'Invite'))
                throw new UnauthorizedError(`You're not allowed to get organization invites.`)

            const invites = await prisma.invite.findMany({
                where: {
                    organizationId: organization.id
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return reply.status(200).send({ invites })
        })
}