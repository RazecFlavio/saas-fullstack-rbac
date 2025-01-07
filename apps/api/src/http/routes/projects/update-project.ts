import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { projectSchema } from "@saas/auth";

export async function updateProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .put('/organization/:slug/projects/:projectId', {
            schema: {
                tags: ['Projects'],
                summary: 'Update a Project',
                security: [{ bearerAuth: [] }],
                body: z.object({
                    name: z.string(),
                    description: z.string()
                }),
                params: z.object({
                    slug: z.string(),
                    projectId: z.string().uuid()
                })
                ,
                response: {
                    204: z.null()
                }
            }
        }, async (req, reply) => {
            const { slug, projectId } = req.params;
            const userId = await req.getCurrentUserId()
            const { membership, organization } = await req.getUserMembership(slug)

            const project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                    organizationId: organization.id
                }
            })

            const authProject = projectSchema.parse(project)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('update', authProject))
                throw new UnauthorizedError(`You're not allowed to update this project.`)

            const { name, description } = req.body;

            await prisma.project.update({
                where: {
                    id: projectId
                },
                data: {
                    name, description
                }
            })
            return reply.status(204).send()
        })
}