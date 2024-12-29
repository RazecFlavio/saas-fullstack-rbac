import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";

export async function getProjects(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .get('/organization/:slug/projects', {
            schema: {
                tags: ['Projects'],
                summary: 'Get all organization projects',
                security: [{ bearerAuth: [] }],
                params: z.object({
                    slug: z.string()
                })
                ,
                response: {
                    200: z.object({
                        projects: z.array(
                            z.object({
                                name: z.string(),
                                id: z.string().uuid(),
                                slug: z.string(),
                                avatarUrl: z.string().url().nullable(),
                                ownerId: z.string().uuid(),
                                organizationId: z.string().uuid(),
                                description: z.string(),
                                owner: z.object({
                                    name: z.string().nullable(),
                                    id: z.string().uuid(),
                                    avatarUrl: z.string().url().nullable()
                                })
                            })
                        )
                    })
                }
            }
        }, async (req, reply) => {
            const { slug } = req.params;
            const userId = await req.getCurrentUserId()

            const { membership, organization } = await req.getUserMembership(slug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('get', 'Project'))
                throw new UnauthorizedError(`You're not allowed to see organization project.`)


            const projects = await prisma.project.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    slug: true,
                    ownerId: true,
                    avatarUrl: true,
                    organizationId: true,
                    createdAt: true,
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true
                        }
                    }
                },
                where: {
                    organizationId: organization.id
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return reply.status(200).send({ projects })

        })
}