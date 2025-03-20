import { ability, getCurrentOrg } from "@/auth/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getInvites } from "@/http/get-invites"

export async function Invites() {
    const currentOrg = await getCurrentOrg()
    const { invites } = await getInvites(currentOrg!)

    const permissions = await ability()

    return (
        <div className="space-y-4">
            {permissions?.can('create', 'Invite') && (
                <Card>
                    <CardHeader>
                        <CardTitle>Invite member</CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            )}

            <div className="rounded border">
                <Table>
                    <TableBody>
                        {invites.map(invite => {
                            return (
                                <TableRow key={invite.id}>
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground">{invite.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                    </TableCell>
                                    <TableCell className="py-2.5">

                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}