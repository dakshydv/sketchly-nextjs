import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
    console.log(`middleware running for ${request.nextUrl.pathname}`);
    
  const token = request.headers.get("authorization") || "";

  if (!token) {
    return NextResponse.json({ message: "unauthorized" }, { status: 403 });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  console.log(JWT_SECRET);
  console.log(token);
  

  if (!JWT_SECRET) {
    console.log("could not access jwt secret");
    return NextResponse.json(
      { message: "server configuration error" },
      { status: 500 }
    );
  }

  const decoded = jwt.verify(token, JWT_SECRET);
    

    if (decoded && typeof decoded === "object" && "userId" in decoded) {
      console.log("success");
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("userId", decoded.userId as string);

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
  ],
};