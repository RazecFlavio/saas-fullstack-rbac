import Image from "next/image";

import rocketseat from '@/assets/rocketseat.png'
import { ProfileButton } from "./profile-button";
import { Slash } from "lucide-react";
import { OrganizationSwitcher } from "./organization-switcher";
import { ability } from "@/auth/auth";

export async function Headers() {
    const permissions = await ability()

    return (
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
            <div className="flex items-center gap-3">
                <Image src={rocketseat} className="size-6" alt="rocketseat" />
                <Slash className="size-3 -rotate-45 text-border" />
                <OrganizationSwitcher />

                {permissions?.can('get', 'Project') && <p>Projetos</p>}
            </div>
            <div className="flex items-center gap-4">
                <ProfileButton />
            </div>
        </div>
    )
}