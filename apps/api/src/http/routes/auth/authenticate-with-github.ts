import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_erros/bad-request-error";
import { prisma } from "@/lib/prisma";
import { env } from "@saas/env";


export async function authenticateWithGithub(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .post('/sessions/github', {
            schema: {
                tags: ['Auth'],
                summary: 'Authenticate with Github',
                body: z.object({
                    code: z.string()
                }),
                response: {
                    201: z.object({
                        token: z.string()
                    })
                }
            }
        }, async (req, reply) => {
            const { code } = req.body;

            console.log('code backend', code)

            const githubOAuthURL = new URL(
                'https://github.com/login/oauth/access_token'
            )
            githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
            githubOAuthURL.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET)
            githubOAuthURL.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI);
            githubOAuthURL.searchParams.set('code', code);

            const githubAccessTokenResponse = await fetch(githubOAuthURL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                }
            })

            const githubAccessTokenData = await githubAccessTokenResponse.json()

            console.log('data', githubAccessTokenData)
            console.log('client_id', env.GITHUB_OAUTH_CLIENT_ID)
            console.log('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET)
            console.log('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI)

            const { access_token: githubAccessToken } = z.object({
                access_token: z.string(),
                token_type: z.literal('bearer'),
                scope: z.string()
            }).parse(githubAccessTokenData)
            console.log('backend')

            const githubUserResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${githubAccessToken}`
                }
            })
            console.log('backend2')
            const githubUserData = await githubUserResponse.json();

            const { id: githubId, name, email, avatar_url: avatarUrl } = z.object({
                id: z.number().int().transform(String),
                avatar_url: z.string().url(),
                name: z.string().nullable(),
                email: z.string().email().nullable()
            }).parse(githubUserData)

            if (email === null) throw new BadRequestError('Your github account must have an email to authenticate!');



            let user = await prisma.user.findUnique({
                where: { email }
            })

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name, email, avatarUrl
                    }
                })
            }

            let account = await prisma.account.findUnique({
                where: {
                    provider_userId: {
                        provider: 'GITHUB',
                        userId: user.id
                    }
                }
            })

            if (!account) {
                account = await prisma.account.create({
                    data: {
                        provider: 'GITHUB',
                        providerAccountId: githubId,
                        userId: user.id
                    }
                })
            }

            const token = await reply.jwtSign({
                sub: user.id
            }, {
                sign: {
                    expiresIn: '7d'
                }
            })

            console.log('token backend', token)

            return reply.status(201).send({ token });
        })
}