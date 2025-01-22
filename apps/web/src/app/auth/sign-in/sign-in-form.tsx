'use client'

import githubIcon from '@/assets/github-icon.svg'
import { Label } from "@/components/ui/label"
import { signInWithEmailAndPassword } from "./actions"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useActionState } from 'react'

import { Loader2 } from 'lucide-react'

export function SignInForm() {

    const [state, formAction, isPending] = useActionState(signInWithEmailAndPassword, undefined)

    return (
        <form action={formAction} className="space-y-4">
            <h1>{state}</h1>
            <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input name="email" type="email" id="email" />
            </div>

            <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input name="password" type="password" id="password" />

                <Link href="/auth/forgot-password"
                    className="text-xs font-medium text-foreground hover:underline">
                    Forgot your password?
                </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>{
                isPending ? (<Loader2 size={4} />) : 'Sign in with e-mail'
            }</Button>

            <Button variant="link" className="w-full" asChild>
                <Link href="/auth/sign-up">
                    Create new account
                </Link>
            </Button>

            <Separator />

            <Button type="submit" variant="outline"
                className="w-full outline">
                <Image src={githubIcon} alt="" className="size-4 mr-2 dark:invert" />
                Sign in with Github
            </Button>
        </form>
    )
}