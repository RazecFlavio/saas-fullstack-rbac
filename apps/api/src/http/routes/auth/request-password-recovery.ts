import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_erros/bad-request-error";
import { auth } from "@/http/middlewares/auth";
import { connected } from "process";

export async function requestPasswordRecovery(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).post(
        '/password/recover', 
        {
        schema: {
            tags: ['Auth'],
            summary: 'Request recovery',
            body: z.object({
                email: z.string().email()
            }),
            response: {
                201: z.null()
                }         
        }
    }, async (req, reply) => {
        const {email } = req.body
        
        const userFromEmail = await prisma.user.findUnique({
            where:{email}
        })

        if(!userFromEmail) return reply.status(201).send() //para evitar que saibam se o usuario existe ou nao!

        const {id:code} = await prisma.token.create({
            data:{
                type: 'PASSWORD_RECOVER',
                userId: userFromEmail.id
            }
        })

        // Send e-mail with password recover link

        console.log('Recover password token: ', code)

        return reply.status(201).send()

    })
}