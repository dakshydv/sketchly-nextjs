import { prisma } from "@/config/utils";
import { NextRequest, NextResponse } from "next/server";

// get room
export async function GET(
  req: NextRequest,
  { params }: { params: { roomName: string } }
) {
  const roomName = await(params).roomName;
  const adminId = Number(req.headers.get("userId"));
  const room = await prisma.room.findFirst({
    where: {
      name: roomName,
      adminId
    },
  });
  if (!room) {
    return NextResponse.json({
      message: "no room found",
    });
  }
  return NextResponse.json({
    room,
  });
}
