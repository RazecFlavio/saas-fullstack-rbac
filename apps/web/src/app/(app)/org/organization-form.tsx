'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMyFormState } from "@/hooks/use-my-form-state";
import { AlertTriangle, Loader2 } from "lucide-react";
import { createOrganizationAction, OrganizationSchema, updateOrganizationAction } from "./actions";

interface OrganizationFormProps {
    isUpdating?: boolean
    initialData?: OrganizationSchema
}

export function OrganizationForm({
    isUpdating = false,
    initialData
}: OrganizationFormProps) {
    const formAction = isUpdating ? updateOrganizationAction : createOrganizationAction

    const [{ success, message, errors }, handleSubmit, isPending] =
        useMyFormState(formAction);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {success === false && message && (
                <Alert variant={'destructive'}>
                    <AlertTriangle className='size-4' />
                    <AlertTitle>Save organization failed</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}
            {success === true && message && (
                <Alert variant={'success'}>
                    <AlertTriangle className='size-4' />
                    <AlertTitle>Saved successfully</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}
            <div className="space-y-1">
                <Label htmlFor="name">Organization name</Label>
                <Input name="name" type="name" id="name" defaultValue={initialData?.name} />
                {errors?.name && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.name[0]}</p>)}
            </div>

            <div className="space-y-1">
                <Label htmlFor="domain">Domain</Label>
                <Input name="domain" type="text" id="domain" inputMode="url" placeholder="example.com" defaultValue={initialData?.domain ?? undefined} />
                {errors?.domain && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.domain[0]}</p>)}
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                    <Checkbox name="shouldAttachUsersByDomain" id="shouldAttachUsersByDomain" defaultChecked={initialData?.shouldAttachUsersByDomain} />
                    <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
                        <span className="text-sm font-medium loading-none">
                            Auto-join new members.
                        </span>
                        <p className="text-sm text-muted-foreground">This will automatically invite all members with same e-mail
                            domain to this organization.</p>
                    </label>
                </div>
                {errors?.shouldAttachUsersByDomain && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.shouldAttachUsersByDomain[0]}</p>)}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    'Save organization'
                )}
            </Button>
        </form>

    )
}