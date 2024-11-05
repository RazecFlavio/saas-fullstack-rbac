import { FastifyInstance } from "fastify"
import { ZodError } from "zod";
import { BadRequestError } from "./routes/_erros/bad-request-error";
import { UnauthorizedError } from "./routes/_erros/unauthorized-error";

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler:FastifyErrorHandler = (error, req, reply)=>{
    if(error instanceof ZodError){
        return reply.status(400).send({
            message: 'Validation error',
            error: error.flatten().fieldErrors
        })
    }
    if(error instanceof BadRequestError){
        return reply.status(400).send({
            message: 'Validation error',
            error: error.message
        })
    }
    if(error instanceof UnauthorizedError){
        return reply.status(401).send({
            message: 'Validation error',
            error: error.message
        })
    }

    console.error(error)

    //Enviar erro para sistema de observabilidade

    return reply.status(500).send({message: 'Internal server error'})
}