import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import createSlug from "@/utils/create-slug";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";

export async function createProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .post('/organization/:slug/projects', {
            schema: {
                tags: ['Projects'],
                summary: 'Create a new Project',
                security: [{ bearerAuth: [] }],
                body: z.object({
                    name: z.string(),
                    description: z.string()
                }),
                params: z.object({
                    slug: z.string()
                })
                ,
                response: {
                    201: z.object({
                        projectId: z.string()
                    })
                }
            }
        }, async (req, reply) => {
            const { slug } = req.params;
            const userId = await req.getCurrentUserId()
            const { membership, organization } = await req.getUserMembership(slug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('create', 'Project')) throw new UnauthorizedError(`You're not allowed to create new project.`)

            const { name, description } = req.body;


            const project = await prisma.project.create({
                data: {
                    name,
                    slug: createSlug(name),
                    description,
                    ownerId: userId,
                    organizationId: organization.id
                }
            })
            return reply.status(201).send({
                projectId: project.id
            })
        })
}