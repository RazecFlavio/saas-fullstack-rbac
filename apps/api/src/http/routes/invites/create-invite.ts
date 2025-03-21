import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_erros/unauthorized-error";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_erros/bad-request-error";

export async function createInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth)
        .post('/organizations/:slug/invite', {
            schema: {
                tags: ['Invites'],
                summary: 'Create a new Invite',
                security: [{ bearerAuth: [] }],
                body: z.object({
                    email: z.string().email(),
                    role: roleSchema
                }),
                params: z.object({
                    slug: z.string()
                })
                ,
                response: {
                    201: z.object({
                        inviteId: z.string().uuid()
                    })
                }
            }
        }, async (req, reply) => {
            const { slug } = req.params;
            const userId = await req.getCurrentUserId()
            const { membership, organization } = await req.getUserMembership(slug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('create', 'Invite')) throw new UnauthorizedError(`You're not allowed to create new invite.`)

            const { email, role } = req.body;

            const [, domain] = email.split('@')

            if (organization.shouldAttachUsersByDomains && organization.domain === domain) {
                throw new BadRequestError(`Users with ${domain} domain will join your organization automatically on login`)
            }

            const inviteWithSameEmail = await prisma.invite.findUnique({
                where: {
                    email_organizationId: {
                        email, organizationId: organization.id
                    }
                }
            })

            if (inviteWithSameEmail) throw new BadRequestError("Invite already exists")

            const memberWithSameEmail = await prisma.member.findFirst({
                where: {
                    organizationId: organization.id,
                    user: {
                        email
                    }
                }
            })

            if (memberWithSameEmail) throw new BadRequestError("Member with this email already exists")

            const invite = await prisma.invite.create({
                data: {
                    organizationId: organization.id,
                    email,
                    role,
                    authorId: userId
                }
            })

            return reply.status(201).send({
                inviteId: invite.id
            })
        })
}