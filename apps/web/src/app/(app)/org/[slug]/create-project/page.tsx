import { Headers } from "@/components/header";
import { ProjectForm } from "./project-form";
import { ability } from "@/auth/auth";
import { redirect } from "next/navigation";


export default async function CreateProject() {
    const permission = await ability();
    if (permission?.cannot('create', 'Project')) {
        redirect('/')
    }
    return (

        <div className="space-y-4 py-4">
            <Headers />

            <main className="mx-auto w-full max-w-[1200px] space-y-4">
                <h1 className="text-2xl font-bold" >Create Project</h1>
                <ProjectForm />
            </main>
        </div>
    )
}