import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jose";

export async function middleware(request: NextRequest) {
  const token = request.headers.get("authorization") || "";

  if (!token) {
    return NextResponse.json({ message: "unauthorized" }, { status: 403 });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.log("could not access jwt secret");
    return NextResponse.json(
      { message: "server configuration error" },
      { status: 500 }
    );
  }

  const jwtKey = jwt.base64url.decode(JWT_SECRET);
  const decoded = await jwt.jwtVerify(token, jwtKey);

  if (decoded) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("userId", decoded.payload.userId as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    return NextResponse.json({ message: "unauthorized" }, { status: 403 });
  }
}

export const config = {
  matcher: [
    "/api/room/:path*",
    "/api/protected/:path*",
    "/api/test/:path*",
    "/api/room/[roomName]/:path*",
    "/api/room/shapes/[roomId]/:path*",
    "/api/room/:path*"
  ],
};
