import { Headers } from "@/components/header";

export default async function Projets() {
    return (
        <div className="space-y-4 py-4">
            <Headers />
            <main className="mx-auto w-full max-w-[1200px]">Projects</main>
        </div>
    );
}
