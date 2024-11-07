import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_erros/bad-request-error";
import { auth } from "@/http/middlewares/auth";

export async function getProfile(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/profile', {
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
        const userId = await req.getCurrentUserId()

        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) throw new BadRequestError('User not found!')

        return reply.status(200).send({ user })
    })
}