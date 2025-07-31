import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log('middleware cleared');                // this needs to be deleted later
    const userId = req.headers.get("userId");
    const { name } = await req.json();

    return NextResponse.json({
        userId,
        name
    })
}