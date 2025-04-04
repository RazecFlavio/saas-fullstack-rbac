import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { getOrganizations } from "@/http/get-organizations";
import { getCurrentOrg } from "@/auth/auth";

export async function OrganizationSwitcher() {
    const currentOrg = await getCurrentOrg();

    const { organizations } = await getOrganizations();

    const currentOrganization = organizations.find(org => org.slug === currentOrg)


    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary " >
                {currentOrganization ? (<>
                    <Avatar className="size-5">
                        <AvatarImage src={currentOrganization.avatarUrl?.toString()} />
                        <AvatarFallback />
                    </Avatar>
                    <span className="truncate">{currentOrganization.name}</span>
                </>) : (
                    <span className="text-muted-foreground">Select organization</span>
                )}
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                alignOffset={-16}
                sideOffset={12}
                className="w-[200px]">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                    {organizations.map(org => {
                        return (
                            <DropdownMenuItem key={org.id} asChild>
                                <Link href={`/org/${org.slug}`}>
                                    <Avatar className="mr-2 size-5">
                                        <AvatarImage src={org.avatarUrl?.toString()} />
                                        <AvatarFallback />
                                    </Avatar>
                                    <span className="line-clamp-1">{org.name}</span>
                                </Link>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={'/create-organization'}>
                        <PlusCircle />
                        <span className="line-clamp-1">Create new organization</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}