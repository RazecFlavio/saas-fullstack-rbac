import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({ role: 'ADMIN', id: 'user-id' })

const project = projectSchema.parse({
    id: 'project-id', ownerId: 'user-id'
})