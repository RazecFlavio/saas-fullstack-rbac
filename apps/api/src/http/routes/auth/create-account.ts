import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_erros/bad-request-error";

export async function createAccount(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
        schema: {
            tags: ['Auth'],
            summary: 'Create a new account',
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().min(6)
            })
        }
    }, async (req, reply) => {
        const { name, email, password } = req.body;

        const usersWithSameEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (usersWithSameEmail) throw new BadRequestError('user with same email already exists!')

        const [, domain] = email.split("@")

        const autoJoinOrganization = await prisma.organization.findFirst({
            where: {
                domain, shouldAttachUsersByDomains: true
            }
        })

        const passwordHash = await hash(password, 6);

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                member_on: autoJoinOrganization ? {
                    create: {
                        organizationId: autoJoinOrganization.id,
                    }
                } : undefined
            }
        })

        return reply.status(201).send();
    })
}