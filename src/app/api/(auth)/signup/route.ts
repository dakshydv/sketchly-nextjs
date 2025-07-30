import { CreateUserSchema } from "@/config/schema";
import { prisma } from "@/config/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  const data = CreateUserSchema.safeParse(requestBody);

  if (!data.success) {
    return NextResponse.json({
      message: "invalid credentials",
    });
  }

  const { name, email, password } = requestBody;

  if (!name || !email || !password) {
    return NextResponse.json({
      message: "please provide all credentails",
    });
    return;
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json({
      message: "user already exists, please sign in",
    });
    return;
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);

  if (!hashedPassword) {
    console.log("could not hash password");
    return;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!user) {
    return NextResponse.json({
      message: "could not create user",
    });
  }

  return NextResponse.json({
    message: "user signed up successfully",
  });
}
