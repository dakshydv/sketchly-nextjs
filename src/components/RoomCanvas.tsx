"use client";
import { useState } from "react";
import { Canvas } from "./Canvas";
import { IconButton } from "./IconButton";
import {
  Circle,
  Diamond,
  Eraser,
  Menu,
  Minus,
  MoveRight,
  Pencil,
  Pointer,
  RectangleHorizontal,
} from "lucide-react";
import { Shapes } from "../config/types";
import { ColorPicker } from "./ColorPicker";
import { StrokeIcon } from "./StrokeIcon";
import { TextIcon } from "./TextIcon";

export function RoomCanvas({ roomId }: { roomId: number }) {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const [tool, setTool] = useState<Shapes>("pointer");
  const [selectedStrokeWidth, setStrokeWidth] = useState<number>(1);
  const [selectedStrokeColor, setStrokeColor] = useState<string>();
  const [selectedBgColor, setBgColor] = useState<string>();
  // useEffect(() => {
  //   const ws = new WebSocket(
  //     "ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1Mjc2MDkxN30.olfJhMnGBQQ4wymGvP1c5DbTU3DmVwlCb0GzYnyNDRY"
  //   );

  //   ws.onopen = () => {
  //     setSocket(ws);
  //     ws.send(
  //       JSON.stringify({
  //         type: "JOIN_ROOM",
  //         roomId,
  //       })
  //     );
  //   };
  // }, []);

  //   if (!socket) {
  //     return <div>Connecting to server</div>;
  //   }

  return (
    <div className="relative w-screen h-screen">
      {tool ? (
        <Canvas
          roomId={roomId}
          tool={tool}
          strokeWidth={selectedStrokeWidth}
          bgColor={selectedBgColor ?? "#121212"}
          strokeColor={selectedStrokeColor ?? "#FFFFFF"}
        />
      ) : (
        <div className="bg-[#121212] w-screen h-screen text-white text-3xl">
          Welcome to Infinidraw
        </div>
      )}
      <div className="fixed flex justify-between w-screen top-8 px-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-[#23232a] backdrop-blur-sm rounded-lg py-2 px-3 flex items-center justify-center text-white">
          <Menu />
        </div>
        {/* tools selection */}
        <div className="bg-[#23232a] backdrop-blur-sm rounded-lg px-3 flex gap-1">
          <IconButton
            onClick={() => setTool("pointer")}
            icon={<Pointer size={18} />}
            theme={
              tool === "pointer" ? "bg-[#403e6a] text-white" : "text-white"
            }
          />
          <IconButton
            onClick={() => setTool("rect")}
            icon={<RectangleHorizontal size={18} />}
            theme={tool === "rect" ? "bg-[#403e6a] text-white" : "text-white"}
          />
          <IconButton
            onClick={() => setTool("diamond")}
            icon={<Diamond size={18} />}
            theme={
              tool === "diamond" ? "bg-[#403e6a] text-white" : "text-white"
            }
          />
          <IconButton
            onClick={() => setTool("circle")}
            icon={<Circle size={18} />}
            theme={tool === "circle" ? "bg-[#403e6a] text-white" : "text-white"}
          />
          <IconButton
            onClick={() => setTool("line")}
            icon={<Minus size={18} fill={tool === "line" ? "#FFFFFF" : ""} />}
            theme={tool === "line" ? "bg-[#403e6a] text-white" : "text-white"}
          />
          <IconButton
            onClick={() => setTool("pencil")}
            icon={<Pencil size={18} />}
            theme={tool === "pencil" ? "bg-[#403e6a] text-white" : "text-white"}
          />
          <IconButton
            onClick={() => setTool("arrow")}
            icon={<MoveRight size={18} />}
            theme={tool === "arrow" ? "bg-[#403e6a] text-white" : "text-white"}
          />
          <IconButton
            onClick={() => setTool("text")}
            // icon={<Type size={18} fill={tool === "text" ? "#FFFFFF" : ""} />}
            icon={<TextIcon />}
            theme={tool === "text" ? "bg-[#403e6a] text-white" : "text-white"}
          />
          <IconButton
            onClick={() => setTool("eraser")}
            icon={<Eraser size={18} />}
            theme={tool === "eraser" ? "bg-[#403e6a] text-white" : "text-white"}
          />
        </div>
        <button className="bg-[#a7a5ff] px-4 rounded-md flex items-center justify-center">
          Share
        </button>
      </div>
      {/* custom options */}
      {tool !== "pointer" && tool !== "eraser" && <div className="fixed px-4 py-4 ml-4 bg-[#23232a] text-white rounded-md top-32 z-10">
        <p className="text-sm">Stroke</p>
        {/* stroke */}
        <div className="mt-1 flex gap-1">
          <ColorPicker
            background="bg-[#d3d3d3]"
            border={
              selectedStrokeColor === "#d3d3d3"
                ? "border-[#5e96d9]"
                : "border-none"
            }
            onClick={() => setStrokeColor("#d3d3d3")}
          />
          <ColorPicker
            background="bg-[#ff7976]"
            border={
              selectedStrokeColor === "#ff7976"
                ? "border-[#5e96d9]"
                : "border-none"
            }
            onClick={() => setStrokeColor("#ff7976")}
          />
          <ColorPicker
            background="bg-[#308e40]"
            border={
              selectedStrokeColor === "#308e40"
                ? "border-[#5e96d9]"
                : "border-none"
            }
            onClick={() => setStrokeColor("#308e40")}
          />
          <ColorPicker
            background="bg-[#589be1]"
            border={
              selectedStrokeColor === "#589be1"
                ? "border-[#5e96d9]"
                : "border-none"
            }
            onClick={() => setStrokeColor("#589be1")}
          />
          <ColorPicker
            background="bg-[#af5900]"
            border={
              selectedStrokeColor === "#af5900"
                ? "border-[#5e96d9]"
                : "border-none"
            }
            onClick={() => setStrokeColor("#af5900")}
          />
        </div>
        {/* background */}
        <p className="mt-3">Background</p>
        <div className="mt-1 flex gap-1">
          <ColorPicker
            background="bg-[#1a1b1e]"
            border={
              selectedBgColor === "#1a1b1e" ? "border-[#5e96d9]" : "border-none"
            }
            onClick={() => setBgColor("#1a1b1e")}
          />
          <ColorPicker
            background="bg-[#121212]"
            border={
              selectedBgColor === "#121212" ? "border-[#5e96d9]" : "border-none"
            }
            onClick={() => setBgColor("#121212")}
          />
          <ColorPicker
            background="bg-[#325252]"
            border={
              selectedBgColor === "#325252" ? "border-[#5e96d9]" : "border-none"
            }
            onClick={() => setBgColor("#325252")}
          />
          <ColorPicker
            background="bg-[#54658a]"
            border={
              selectedBgColor === "#54658a" ? "border-[#5e96d9]" : "border-none"
            }
            onClick={() => setBgColor("#54658a")}
          />
          <ColorPicker
            background="bg-[#8a5460]"
            border={
              selectedBgColor === "#8a5460" ? "border-[#5e96d9]" : "border-none"
            }
            onClick={() => setBgColor("#8a5460")}
          />
        </div>
        {/* stroke width */}
        <p className="mt-3">Stroke width</p>
        <div className="mt-1 flex gap-1">
          <StrokeIcon
            onClick={() => setStrokeWidth(1)}
            strokeWidth={1}
            theme={selectedStrokeWidth === 1 ? "bg-[#403e6a]" : "bg-[#2e2d39]"}
          />
          <StrokeIcon
            onClick={() => setStrokeWidth(2)}
            strokeWidth={2}
            theme={selectedStrokeWidth === 2 ? "bg-[#403e6a]" : "bg-[#2e2d39]"}
          />
          <StrokeIcon
            onClick={() => setStrokeWidth(3)}
            strokeWidth={3}
            theme={selectedStrokeWidth === 3 ? "bg-[#403e6a]" : "bg-[#2e2d39]"}
          />
        </div>
      </div>}
    </div>
  );
}
