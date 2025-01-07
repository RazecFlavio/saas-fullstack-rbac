import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { roleSchema } from "@saas/auth";

export async function getMembers(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .get('/organizations/:slug/members'
            , {
                schema: {
                    tags: ['Members'],
                    summary: 'Get All Organizations Member',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string()
                    })
                    ,
                    response: {
                        200: z.object({
                            members: z.array(
                                z.object({
                                    userId: z.string().uuid(),
                                    id: z.string().uuid(),
                                    role: roleSchema,
                                    name: z.string().nullable(),
                                    avatarUrl: z.string().url().nullable(),
                                    email: z.string().email(),
                                })
                            )
                        })
                    }
                }
            }, async (req, reply) => {
                const { slug } = req.params;
                const userId = await req.getCurrentUserId()

                const { membership, organization } =
                    await req.getUserMembership(slug)

                const { cannot } = getUserPermissions(userId, membership.role)

                if (cannot('get', 'User'))
                    throw new UnauthorizedError(`You're not allowed to see organization members.`)


                const members = await prisma.member.findMany({
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true
                            }
                        }
                    },
                    where: {
                        organizationId: organization.id
                    },
                    orderBy: {
                        role: 'asc'
                    }
                })

                const membersWithRoles = members
                    .map(({ user: { id: userId, ...user }, ...member }) => {
                        return {
                            ...user,
                            ...member,
                            userId
                        }
                    })

                return reply.status(200).send({ members: membersWithRoles })

            })
}