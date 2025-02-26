import { Header } from "@/components/header";
import { Tabs } from "@/components/tabs";
import { ReactNode } from "react";

export default async function OrgLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <div>
            <div className="pt-6">
                <Header />
                <Tabs />
            </div>
            <main className="mx-auto w-full max-w-[1200px] py-4">
                {children}
            </main>
        </div>
    )
}