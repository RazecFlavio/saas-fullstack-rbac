import { FormEvent, useState, useTransition } from "react";
import { requestFormReset } from 'react-dom'

interface FormState {
    success: boolean,
    message: string | null,
    errors: Record<string, string[]> | null
}

export function useMyFormState(
    action: (data: FormData) => Promise<FormState>,
    onSuccess?: () => Promise<void> | null,
    initialState?: FormState
) {
    const [isPending, startTransition] = useTransition();

    const [formState, setFormState] = useState(initialState ?? {
        success: false,
        message: null,
        errors: null
    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const form = e.currentTarget
        const data = new FormData(form)

        startTransition(async () => {
            const state = await action(data)
            if (state.success === true && onSuccess) {
                await onSuccess()
            }
            setFormState(state)
            requestFormReset(form)
        })



    }

    return [formState, handleSubmit, isPending] as const
}