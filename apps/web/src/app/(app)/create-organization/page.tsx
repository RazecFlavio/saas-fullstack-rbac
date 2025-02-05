import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateOrganization() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold" >Create Organization</h1>

            <form action="" className="space-y-4">
                {/* {success === false && message && (
                    <Alert variant={'destructive'}>
                        <AlertTriangle className='size-4' />
                        <AlertTitle>Sign in failed</AlertTitle>
                        <AlertDescription>
                            <p>{message}</p>
                        </AlertDescription>
                    </Alert>
                )} */}
                <div className="space-y-1">
                    <Label htmlFor="name">Organization name</Label>
                    <Input name="name" type="name" id="name" />
                    {/* {errors?.name && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.name[0]}</p>)} */}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="domain">Domain</Label>
                    <Input name="domain" type="text" id="domain" inputMode="url" placeholder="example.com" />
                    {/* {errors?.email && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.email[0]}</p>)} */}
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                        <Checkbox name="shouldAttackUsersByDomain" id="shouldAttackUsersByDomain" />
                        <label htmlFor="shouldAttackUsersByDomain" className="space-y-1">
                            <span className="text-sm font-medium loading-none">
                                Auto-join new members.
                            </span>
                            <p className="text-sm text-muted-foreground">This will automatically invite all members with same e-mail
                                domain to this organization.</p>
                        </label>
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Save organization
                </Button>
            </form>

        </div>
    )
}