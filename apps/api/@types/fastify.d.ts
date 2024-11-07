import 'fastify'
declare module 'fastify'{
    export interface FastifyRequest {
        getCurrentUserId(): Promise<string>
    }
}


//Para funcionar precisa incluir no tsconfig..."@types/*"