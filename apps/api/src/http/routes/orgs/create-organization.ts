import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_erros/bad-request-error";
import createSlug from "@/utils/create-slug";

export async function createOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organization', {
        schema: {
            tags: ['Organizations'],
            summary: 'Create a new Organization',
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string(),
                domain: z.string().nullish(),
                shouldAttachUsersByDomains: z.boolean().optional()
            }),
            response: {
                201: z.object({
                    organizationId: z.string()
                })
            }
        }
    }, async (req, reply) => {
        const userId = await req.getCurrentUserId()
        const { name, domain, shouldAttachUsersByDomains } = req.body;

        if (domain) {
            const organizationByDomain = await prisma.organization.findUnique({
                where: {
                    domain
                }
            })
            if (organizationByDomain) throw new BadRequestError('Another organization with same domain already exists');
        }

        const organization = await prisma.organization.create({
            data: {
                name,
                slug: createSlug(name),
                domain,
                shouldAttachUsersByDomains,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: 'ADMIN'
                    }
                }
            }
        })
        return reply.status(201).send({
            organizationId: organization.id
        })
    })
}