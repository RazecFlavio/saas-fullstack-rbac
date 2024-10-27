import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider
} from 'fastify-type-provider-zod'

import { createAccount } from "./routes/auth/create-account";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Next.js saas',
            description: 'Full-stack SaaS app with multi-tenant & RBAC',
            version: '1.0.0',
        },
        servers: [],
    },
    transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

app.register(fastifyCors)

app.register(createAccount)

app.listen({ port: 3333 }).then(() => {
    console.log("Running HTTP server ")
})

