import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_erros/bad-request-error";

export async function getProfile(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/profile', {
        schema: {
            tags: ['auth'],
            summary: 'Get authenticate user profile',
            response: {
                200: z.object({
                    user: z.object({
                        id: z.string().uuid(),
                        name: z.string().nullable(),
                        email: z.string().email(),
                        avatarUrl: z.string().url().nullable()
                    })
                })
            }
        }
    }, async (req, reply) => {
        const { sub } = await req.jwtVerify<{ sub: string }>()

        const user = await prisma.user.findUnique({ where: { id: sub } })

        if (!user) throw new BadRequestError('User not found!')

        return reply.status(200).send({ user })
    })
}