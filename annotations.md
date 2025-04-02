## criando backend

- pnpm i fastify fastify-type-provider-zod @fastify/cors zod

- pnpm i prisma -D

- pnpm prisma init

- pnpm prisma migrate dev "criando migrations"

- pnpm i bcryptjs

- pnpm i @types/bcryptjs -D

- pnpm i @faker-js/faker -D ### Cria dados fake para ajudar nos testes!

- pnpm prisma db seed ### apos criar script em package.json rodar o comando

- pnpm i @fastify/swagger ## gerar documentação ---documentação da configuracao https://github.com/turkerdev/fastify-type-provider-zod

- pnpm i @fastify/swagger-ui ### visualização da documentação criado pelo swagger.

- pnpm i @fastify/jwt ##para a criação dos tokens

#### criando o midlleware

-pnpm i fastify-plugin --para envolver os middleware

-https://github.com/login/oauth/authorize?client_id=Ov23liSnM4eAEx91a5if&redirect_uri=http://localhost:3333/api/auth/callback&scope=user:email

-pnpm i @t3-oss/env-nextjs --- pacote para permitir separar as variaveis de ambiente

-pnpm i dotenv-cli -D //no packager.json da api, no scripts -- serve para identificar que a partir do -- será outro comando á ser executado!

## novo ambiente

- apos subir o ambiente no docker
- pnpm prisma generate
- pnpm prisma migrate dev

# para deploy backend

- pnpm i tsup -D
- criar arquivo tsup.config.ts dentro da api

# para deploy frontend

- npx eslint --fix src --ext .ts,.tsx

  - Foi necessario adicionar o arquivo .eslintrc.json na raiz do projeto web

- npx tsc --noEmit
