import { shapesMessage } from "@/config/types";
import { prisma } from "@/config/utils";
import { NextRequest, NextResponse } from "next/server";

// get all the shapes
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: number }> }
) {
  const roomId = Number((await params).roomId);
  const userId = Number(req.headers.get("userId"));

  if (!roomId) {
    return NextResponse.json({
      message: "provide roomId",
    });
  }

  const shapes = await prisma.shape.findMany({
    where: {
      roomId,
      userId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });

  if (!shapes || shapes.length === 0) {
    return NextResponse.json({
      message: "no shape in this room",
    });
  }

  return NextResponse.json({
    shapes,
  });
}

// create shape
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: number }> }
) {
  const { shapes } = await req.json();
  const roomId = Number((await params).roomId);
  const userId = Number(req.headers.get("userId"));

  if (!shapes) {
    return NextResponse.json({
      message: "please give shapes",
    });
  }

  try {
    shapes.map(async (shape: shapesMessage) => {
      await prisma.shape.create({
        data: {
          roomId,
          userId,
          message: JSON.stringify(shape),
        },
      });
    });
    return NextResponse.json({
      message: "shapes saved successfully",
    });
  } catch (err) {
    return NextResponse.json({
      message: "an error occured while saving shapes",
      err,
    });
  }
}

// remove all the shapes
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: number }> }
) {
  const roomId = Number((await params).roomId);
  const userId = Number(req.headers.get("userId"));

  try {
    await prisma.shape.deleteMany({
      where: {
        roomId,
        userId,
      },
    });
    return NextResponse.json({
      message: "canvas cleared for the room",
    });
  } catch (err) {
    return NextResponse.json({
      message: "an error occuered while clearing canvas",
      err
    });
  }
}
