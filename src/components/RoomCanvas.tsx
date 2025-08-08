"use client";
import { useEffect, useRef, useState } from "react";
import { Engine } from "@/canvas-engine/engine";
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
  Trash2,
} from "lucide-react";
import { Shapes, shapesMessage } from "../config/types";
import { ColorPicker } from "./ColorPicker";
import { StrokeIcon } from "./StrokeIcon";
import { TextIcon } from "./TextIcon";

export function RoomCanvas({ roomId }: { roomId: number }) {
  const [tool, setTool] = useState<Shapes>("pointer");
  const [selectedStrokeWidth, setStrokeWidth] = useState<number>(1);
  const [selectedStrokeColor, setStrokeColor] = useState<string>("#d3d3d3");
  const [selectedBgColor, setBgColor] = useState<string>("#121212");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<Engine>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      // Safely handle localStorage access
      let existingShapes: shapesMessage[] = [];

      try {
        const shapesData = localStorage.getItem(`shapes_room_${roomId}`);
        if (shapesData) {
          existingShapes = JSON.parse(shapesData);
          console.log("Loaded shapes from localStorage:", existingShapes);
        } else {
          console.log(
            "No existing shapes found in localStorage for room:",
            roomId
          );
        }
      } catch (error) {
        console.error("Error parsing shapes from localStorage:", error);
        localStorage.removeItem(`shapes_room_${roomId}`);
      }

      const newEngine = new Engine(
        canvasRef.current,
        roomId,
        selectedBgColor ?? "#121212",
        selectedStrokeColor ?? "#FFFFFF",
        selectedStrokeWidth,
        existingShapes
      );
      setEngine(newEngine);

      return () => {
        newEngine.cleanup();
      };
    }
  }, [canvasRef.current, roomId]);

  useEffect(() => {
    if (engine) {
      console.log(`changing tool to ${tool}`);
      engine.setTool(tool);
    }
  }, [tool, engine]);

  useEffect(() => {
    engine?.setBgColor(selectedBgColor);
  }, [selectedBgColor]);

  useEffect(() => {
    engine?.setStrokeColor(selectedStrokeColor);
  }, [selectedStrokeColor]);

  useEffect(() => {
    engine?.setStrokeWidth(selectedStrokeWidth);
  }, [selectedStrokeWidth]);

  function handleClear() {
    if (
      engine &&
      confirm(
        "Are you sure you want to clear the canvas? This action cannot be undone."
      )
    ) {
      engine.clearLocalStorage();
      engine.existingShapes = [];
      engine.clearCanvas();
      console.log("Canvas cleared");
    }
  }

  return (
    <div className="relative w-screen h-screen">
      {tool ? (
        <canvas
          ref={canvasRef}
          height={dimensions.height}
          width={dimensions.width}
          className={`${
            tool !== "pointer" && tool !== "eraser"
              ? "cursor-crosshair-plus"
              : ""
          }
      ${tool === "eraser" && "cursor-eraser"}
      ${tool === "pointer" && "cursor-pointer"}`}
        ></canvas>
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
      {tool !== "pointer" && tool !== "eraser" && (
        <div className="fixed px-4 py-4 ml-4 bg-[#23232a] text-white rounded-md top-32 z-10">
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
                selectedBgColor === "#1a1b1e"
                  ? "border-[#5e96d9]"
                  : "border-none"
              }
              onClick={() => setBgColor("#1a1b1e")}
            />
            <ColorPicker
              background="bg-[#121212]"
              border={
                selectedBgColor === "#121212"
                  ? "border-[#5e96d9]"
                  : "border-none"
              }
              onClick={() => setBgColor("#121212")}
            />
            <ColorPicker
              background="bg-[#325252]"
              border={
                selectedBgColor === "#325252"
                  ? "border-[#5e96d9]"
                  : "border-none"
              }
              onClick={() => setBgColor("#325252")}
            />
            <ColorPicker
              background="bg-[#54658a]"
              border={
                selectedBgColor === "#54658a"
                  ? "border-[#5e96d9]"
                  : "border-none"
              }
              onClick={() => setBgColor("#54658a")}
            />
            <ColorPicker
              background="bg-[#8a5460]"
              border={
                selectedBgColor === "#8a5460"
                  ? "border-[#5e96d9]"
                  : "border-none"
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
              theme={
                selectedStrokeWidth === 1 ? "bg-[#403e6a]" : "bg-[#2e2d39]"
              }
            />
            <StrokeIcon
              onClick={() => setStrokeWidth(2)}
              strokeWidth={2}
              theme={
                selectedStrokeWidth === 2 ? "bg-[#403e6a]" : "bg-[#2e2d39]"
              }
            />
            <StrokeIcon
              onClick={() => setStrokeWidth(3)}
              strokeWidth={3}
              theme={
                selectedStrokeWidth === 3 ? "bg-[#403e6a]" : "bg-[#2e2d39]"
              }
            />
          </div>
        </div>
      )}

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-4">
        <button
          className="bg-[#ff7976] hover:bg-[#ff6864] px-6 py-3 rounded-lg flex items-center gap-2 text-white font-medium shadow-lg transition-colors"
          onClick={handleClear}
        >
          <Trash2 size={20} />
          Clear
        </button>
      </div>
    </div>
  );
}
