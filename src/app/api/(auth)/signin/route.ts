import { SignInSchema } from "@/config/schema";
import { prisma } from "@/config/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as jwt from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  const data = SignInSchema.safeParse(requestBody);

  if (!data.success) {
    return NextResponse.json(
      {
        message: data.error.message,
      },
      {
        status: 403,
      }
    );
  }

  const { email, password } = requestBody;

  if (!email || !password) {
    return NextResponse.json(
      {
        message: "please provide all required credentials",
      },
      {
        status: 403,
      }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "user does not exist, please sign up",
      },
      {
        status: 404,
      }
    );
  }

  const isPasswordCorrect = bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return NextResponse.json(
      {
        message: "incorrect password",
      },
      {
        status: 403,
      }
    );
  }

  if (!JWT_SECRET) {
    return NextResponse.json(
      {
        message: "please sign in again",
      },
      {
        status: 401,
      }
    );
  }

  const jwtKey = jwt.base64url.decode(JWT_SECRET);
  const token = await new jwt.SignJWT({
    userId: user.id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .sign(jwtKey);

  return NextResponse.json(
    {
      message: "user signed in successfully",
      token,
    },
    {
      status: 200,
    }
  );
}
