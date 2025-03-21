'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMyFormState } from "@/hooks/use-my-form-state";
import { AlertTriangle, Loader2 } from "lucide-react";
import { createInviteAction } from "./actions";

export function CreateInviteForm() {
    const [{ success, message, errors }, handleSubmit, isPending] =
        useMyFormState(createInviteAction, async () => { },
        );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {success === false && message && (
                <Alert variant={'destructive'}>
                    <AlertTriangle className='size-4' />
                    <AlertTitle>Invite failed!</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}
            {success === true && message && (
                <Alert variant={'success'}>
                    <AlertTriangle className='size-4' />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex items-center gap-2">
                <div className="space-y-1 flex-1">
                    <Input name="email" type="email" id="email" placeholder="John@exemple.com" />
                    {errors?.email && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.name[0]}</p>)}
                </div>
                <Select name="role" defaultValue="MEMBER">
                    <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="BILLING">Billing</SelectItem>
                    </SelectContent>
                </Select>
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        'Send Invite'
                    )}
                </Button>
            </div>
        </form>

    )
}