import { z } from "zod"

//apenas campos importantes para a parte de permissionamento.
//não é necessario colocar todos os campos de projetos aqui!
export const projectSchema = z.object({
    __typename: z.literal('Project').default('Project'),
    id: z.string(),
    ownerId: z.string()
})

export type Project = z.infer<typeof projectSchema>