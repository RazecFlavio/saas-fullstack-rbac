import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { prisma } from "@/lib/prisma";


export async function getOrganizationBilling(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .get('/organizations/:slug/billing', {
            schema: {
                tags: ['Billing'],
                summary: 'Get billing information from Organization',
                security: [{ bearerAuth: [] }],
                params: z.object({
                    slug: z.string()
                }),
                response: {
                    200: z.object({
                        billing: z.object({
                            seats: z.object({
                                amount: z.number(),
                                unit: z.number(),
                                price: z.number(),
                            }),
                            projects: z.object({
                                amount: z.number(),
                                unit: z.number(),
                                price: z.number(),
                            }),
                            total: z.number(),
                        })
                    })
                }
            }
        }, async (req, reply) => {
            const { slug } = req.params;
            const userId = await req.getCurrentUserId();
            const { organization, membership } = await req.getUserMembership(slug);

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('get', 'Billing'))
                throw new UnauthorizedError(`You're not allowed to get billing details from this organization.`)

            const [amountOfMembers, amountOfProjects] = await Promise.all([
                prisma.member.count({
                    where: {
                        organizationId: organization.id,
                        role: { not: 'BILLING' }
                    }
                }),
                prisma.project.count({
                    where: {
                        organizationId: organization.id
                    }
                })
            ])


            return reply.status(200).send({
                billing: {
                    seats: {
                        amount: amountOfMembers,
                        unit: 10,
                        price: amountOfMembers * 10
                    },
                    projects: {
                        amount: amountOfProjects,
                        unit: 20,
                        price: amountOfProjects * 20
                    },
                    total: (amountOfMembers * 10) + (amountOfProjects * 20)
                }
            })
        })
}