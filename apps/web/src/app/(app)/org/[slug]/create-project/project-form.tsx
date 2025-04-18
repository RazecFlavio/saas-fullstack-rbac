'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMyFormState } from "@/hooks/use-my-form-state";
import { AlertTriangle, Loader2 } from "lucide-react";
import { createProjectAction } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { queryClient } from "@/lib/react-query";

export function ProjectForm() {
    const { slug: org } = useParams<{ slug: string }>();

    const [{ success, message, errors }, handleSubmit, isPending] =
        useMyFormState(createProjectAction, async () => {
            queryClient.invalidateQueries({
                queryKey: [org, 'projects']
            })
        });

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {success === false && message && (
                <Alert variant={'destructive'}>
                    <AlertTriangle className='size-4' />
                    <AlertTitle>Save project failed</AlertTitle>
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
                <Label htmlFor="name">Project name</Label>
                <Input name="name" type="name" id="name" />
                {errors?.name && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.name[0]}</p>)}
            </div>

            <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" id="description" inputMode="url" placeholder="example.com" />
                {errors?.description && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.description[0]}</p>)}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    'Save project'
                )}
            </Button>
        </form>

    )
}