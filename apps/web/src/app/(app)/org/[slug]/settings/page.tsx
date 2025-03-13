import { ability, getCurrentOrg } from "@/auth/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationForm } from "../../organization-form"
import { ShutdownOrganizationButton } from "./shutdown-organization-button"
import { getOrganization } from "@/http/get-organization"
import { Billing } from "./billing"

export default async function Settings() {
    const permissions = await ability()
    const currentOrg = await getCurrentOrg()

    const canUpdateOrganization = permissions?.can('update', 'Organization')
    const canGetBilling = permissions?.can('get', 'Billing')
    const canShutdownOrganization = permissions?.can('delete', 'Organization')

    const { organization } = await getOrganization(currentOrg!)

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold" >Settings</h1>
            <div className="space-y-4">
                {canUpdateOrganization && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization settings</CardTitle>
                            <CardDescription>Update your organization details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrganizationForm isUpdating initialData={{
                                name: organization.name,
                                domain: organization.domain,
                                shouldAttachUsersByDomain: organization.shouldAttachUsersByDomains
                            }} />
                        </CardContent>
                    </Card>
                )}
            </div>

            {canGetBilling && <Billing />}

            {canShutdownOrganization && (
                <Card>
                    <CardHeader>
                        <CardTitle>Shutdown organization</CardTitle>
                        <CardDescription>This will delete all organization data incluing all projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ShutdownOrganizationButton />
                    </CardContent>
                </Card>
            )}
        </div >
    )
}