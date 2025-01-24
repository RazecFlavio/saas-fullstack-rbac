import { auth } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WrapperPage } from "./wrapper-page";

export default async function Home() {
  const user = await auth();
  return (<>
    <WrapperPage a={user} />
    <Link href={'/auth/sign-in'}><Button>Sign in</Button></Link>
  </>
  );
}
