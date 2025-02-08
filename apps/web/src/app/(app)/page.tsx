import { Headers } from "@/components/header";

export default async function Home() {
  return (
    <div className="space-y-4 py-4">
      <Headers />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <p className="text-sm text-muted-foreground">
          Select a organization
        </p>
      </main>
    </div>
  );
}
