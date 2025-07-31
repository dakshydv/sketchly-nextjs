import { prisma } from "@/config/utils";
import { NextRequest, NextResponse } from "next/server";

// create new room
export async function POST(req: NextRequest) {
  const { roomName } = await req.json();
  const adminId= Number(req.headers.get("userId"));

  if (!adminId) {
    return NextResponse.json({
      message: "did not receive admin id",
    });
  }

  if (!roomName) {
    return NextResponse.json({
      message: "please provide a room name",
    });
  }

  const roomExists = await prisma.room.findFirst({
    where: {
      name: roomName,
      adminId
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
      adminId,
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