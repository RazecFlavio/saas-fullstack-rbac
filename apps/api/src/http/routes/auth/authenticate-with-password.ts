import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function authenticateWithPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/sessions/password', {
        schema: {
            tags: ['auth'],
            summary: 'Authenticate with password',
            body: z.object({
                email: z.string().email(),
                password: z.string()
            }),
            response: {
                201: z.object({
                    token: z.string()
                }),
                400: z.object({
                    message: z.string()
                })
            }
        }
    }, async (req, reply) => {
        const { email, password } = req.body;

        const userFromEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (!userFromEmail) return reply.status(400).send({ message: 'Invalid credentials' })

        if (userFromEmail.passwordHash === null) return reply.status(400).send({ message: 'User does not have password, use social login.' })

        const isPasswordValid = await compare(password, userFromEmail.passwordHash)

        if (!isPasswordValid) return reply.status(400).send({ message: 'Invalid credentials' })

        const token = await reply.jwtSign({
            sub: userFromEmail.id
        }, {
            sign: {
                expiresIn: '7d'
            }
        })

        return reply.status(201).send({ token })
    })
}