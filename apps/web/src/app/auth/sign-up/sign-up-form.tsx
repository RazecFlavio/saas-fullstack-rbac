'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import githubIcon from '@/assets/github-icon.svg'
import Image from "next/image";
import { useMyFormState } from "@/hooks/use-my-form-state";
import { signUpAction } from "./action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { signWithGithub } from "../action";


export function SignUpForm() {
    const [{ success, message, errors }, handleSignUp, isPending] =
        useMyFormState(signUpAction);

    return (
        <form action="" onSubmit={handleSignUp} className="space-y-4">
            {success === false && message && (
                <Alert variant={'destructive'}>
                    <AlertTriangle className='size-4' />
                    <AlertTitle>Sign in failed</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}
            <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input name="name" type="name" id="name" />
                {errors?.name && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.name[0]}</p>)}
            </div>

            <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input name="email" type="email" id="email" />
                {errors?.email && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.email[0]}</p>)}
            </div>

            <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input name="password" type="password" id="password" />
                {errors?.password && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.password[0]}</p>)}
            </div>
            <div className="space-y-1">
                <Label htmlFor="password_confirmation">Confirma your password</Label>
                <Input name="password_confirmation" type="password" id="password_confirmation" />
                {errors?.password_confirmation && (<p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.password_confirmation[0]}</p>)}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>{
                isPending ? (<Loader2 size={4} />) : 'Create account'
            }</Button>

            <Button variant="link" className="w-full" asChild>
                <Link href="/auth/sign-in">
                    Already registered? Sign in
                </Link>
            </Button>
            <Separator />

            <form action={signWithGithub}>
                <Button type="submit" variant="outline"
                    className="w-full outline">
                    <Image src={githubIcon} alt="" className="size-4 mr-2 dark:invert" />
                    Sign un with Github
                </Button>
            </form>
        </form>
    )
}