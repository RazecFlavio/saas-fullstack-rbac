## Revisão Geral

- monorepo - para manter o backend e o frontend no mesmo repositorio
- utilizando pnpm -> criando novo monorepo com turborepo -> documentation get started
- RBAC -> Autorização baseado em cargos do usuários
- Definir as permissões em arquivos e nao no banco de dados. Assim agiliza o processo.
- Criar um pacote -> auth: Definir o package.json dele.

# CASL->

- user action -> Descreve o que o usuario pode fazer, sempre um verbo.
- Subject -> Entidades.
- Fields -> Campos da entidade, permitindo que as permissões sejam mais granulares.
- Conditions -> Condições para aplicar a permissão.
- Instalando o CASL
  - pnpm i @casl/ability

# Criando node(api)

- criar o package.json
- rodar o pnpm install na pasta da api
- rodar pnpm tsx @types/node -D
- criando tsconfig.json pegar no github a versao do node copiar dentro da pasta package e no tsconfig.json criado na api extender dos pacotes.
- cria script dev no package.json da api.
- adicionar o pacote de permissões @saas/auth para utilizar o ability
- criar arquivo permissions dentro do pacote auth
- criar pasta model para definir os tipos.
- pnpm i zod para tipar as subjects
- as subjects precisam ter o atributo \_typename caso deseja condicionar as permissões. Assim na function padrao detectSubjectType será possivel identificar de qual entidade iremos aplicar as permissões.
- criar pasta routes e criar as rotas.

# Implementando o backend

- Dentro da pasta da api -> apps/api
- pnpm i fastify fastify-type-provider-zod @fastify/cors zod
- criar pasta http e o arquivo server.ts
- No fastifyCors vc define qual front-end irá acessar seu backend, por padrao esta todos.
- pnpm i prisma -D

- criar o docker-compose.yml

- pnpm prisma init

- pnpm prisma migrate dev "criando migrations"

- criar a pasta lib e o arquivo de conexão com o prisma.

- ajustar o alias [/src] = @

- pnpm i bcryptjs

- pnpm i @types/bcryptjs -D

- pnpm i @faker-js/faker -D ### Cria dados fake para ajudar nos testes!

- criar arquivo seed.ts dentro da pasta prisma.

- pnpm prisma db seed ### apos criar script em package.json rodar o comando

- pnpm i @fastify/swagger ## gerar documentação ---documentação da configuracao https://github.com/turkerdev/fastify-type-provider-zod

- pnpm i @fastify/swagger-ui ### visualização da documentação criado pelo swagger.

- pnpm i @fastify/jwt ##para a criação dos tokens

#### criando o midlleware

-pnpm i fastify-plugin --para envolver os middleware

- criar types em @types para adicionar funções no request do fastify, para que o middleware tenha funcionalidades como buscar o id do usuario ou organização ou qualquer outra informação customizada. Adicionar no tsconfig.json os arquivos de @types.

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

- Adicionar todas as variaveis de ambiente no turbo.json ou na hora de rodar o comando build

- comando build original: turbo run build
- comando build para ler variaveis de ambiente: turbo run build --env-mode=loose

// "env":
// [
// "DATABASE_URL",
// "JWT_SECRET",
// "GITHUB_OAUTH_CLIENT_ID",
// "GITHUB_OAUTH_CLIENT_SECRET",
// "GITHUB_OAUTH_CLIENT_REDIRECT_URI",
// "NEXT_PUBLIC_API_URL"
// ]
