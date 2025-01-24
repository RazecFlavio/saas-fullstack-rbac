import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();

    const redirectURL = req.nextUrl.clone()
    redirectURL.pathname = '/auth/sign-in'

    cookieStore.delete('token')

    return NextResponse.redirect(redirectURL)

}