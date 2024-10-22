import { AbilityBuilder } from "@casl/ability"
import { AppAbility } from "."
import { User } from "./models/user"

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

type Role = 'ADMIN' | 'MEMBER'

export const permissions: Record<Role, PermissionsByRole> = {
    ADMIN(_, builder) { },
    MEMBER(_, builder) { }
}