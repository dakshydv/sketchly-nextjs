import { prisma } from "@/config/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { roomName } = await req.json();
  const userId = req.headers.get("userId");
  console.log(`roomname is ${roomName}`);
  console.log(`user id is ${userId}`);

  if (!userId) {
    return NextResponse.json({
      message: "did not receive user id",
    });
    return;
  }

  if (!roomName) {
    return NextResponse.json({
      message: "please provide a room name",
    });
  }

  const roomExists = await prisma.room.findFirst({
    where: {
      name: roomName,
    },
  });

  if (roomExists) {
    return NextResponse.json({
      message: "this room already exits, please choose another name",
    });
  }

  const room = await prisma.room.create({
    data: {
      name: roomName,
      adminId: Number(userId),
    },
  });

  if (!room) {
    return NextResponse.json({
      message: "an error occured while creating room",
    });
  }

  return NextResponse.json({
    message: "room created successfully",
    roomId: room.id,
  });
}
