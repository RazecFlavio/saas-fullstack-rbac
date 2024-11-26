import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { organizationSchema } from "@saas/auth";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { BadRequestError } from "../_erros/bad-request-error";

export async function transferOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/organizations/:slug/owner', {
        schema: {
            tags: ['Organizations'],
            summary: 'Transger organization ownership',
            security: [{ bearerAuth: [] }],
            body: z.object({
                transferToUserId: z.string().uuid()
            }),
            params: z.object({
                slug: z.string()
            }),
            response: {
                204: z.null()
            }
        }
    }, async (req, reply) => {
        const { slug } = req.params;

        const userId = await req.getCurrentUserId()
        const { membership, organization } = await req.getUserMembership(slug);

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('transfer_ownership', authOrganization)) throw new UnauthorizedError(`You're not allowed to transfer this organization`);

        const { transferToUserId } = req.body;

        const transferToMembership = await prisma.member.findUnique({
            where: {
                organizationId_userId: {
                    organizationId: organization.id,
                    userId: transferToUserId
                }
            }
        })

        if (!transferToMembership) throw new BadRequestError('Target user is not a member of this organization')

        await prisma.$transaction([
            prisma.member.update({
                where: {
                    organizationId_userId: {
                        organizationId: organization.id,
                        userId: transferToUserId
                    }
                },
                data: {
                    role: 'ADMIN'
                }
            }),
            prisma.organization.update({
                where: {
                    id: organization.id
                },
                data: {
                    ownerId: transferToUserId
                }
            })
        ])

        return reply.status(204).send();
    })
}