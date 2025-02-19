import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { BadRequestError } from "../_erros/bad-request-error";

export async function getProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .get('/organizations/:orgSlug/projects/:projectSlug', {
            schema: {
                tags: ['Projects'],
                summary: 'Get Project details',
                security: [{ bearerAuth: [] }],
                params: z.object({
                    orgSlug: z.string(),
                    projectSlug: z.string()
                })
                ,
                response: {
                    200: z.object({
                        project: z.object({
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
                    })
                }
            }
        }, async (req, reply) => {
            const { orgSlug, projectSlug } = req.params;
            const userId = await req.getCurrentUserId()

            const { membership, organization } = await req.getUserMembership(orgSlug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('get', 'Project'))
                throw new UnauthorizedError(`You're not allowed to see this project.`)


            const project = await prisma.project.findUnique({
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
                    slug: projectSlug,
                    organizationId: organization.id
                }
            })

            if (!project) throw new BadRequestError('Project not found!')

            return reply.status(200).send({ project })

        })
}