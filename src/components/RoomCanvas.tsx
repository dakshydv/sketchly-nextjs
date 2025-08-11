"use client";
import { useEffect, useRef, useState } from "react";
import { Engine } from "@/canvas-engine/engine";
import { IconButton } from "./IconButton";
import {
  IconBrandGithub,
  IconBrandLinkedinFilled,
  IconBrandX,
  IconBrightnessUp,
  IconMoon,
  IconWorld,
} from "@tabler/icons-react";
import {
  Circle,
  Command,
  Diamond,
  Download,
  Eraser,
  Menu,
  Minus,
  MoveRight,
  Pencil,
  Pointer,
  RectangleHorizontal,
  Share2,
  Trash,
  Upload,
} from "lucide-react";
import { Shapes, shapesMessage } from "../config/types";
import { ColorPicker } from "./ColorPicker";
import { StrokeIcon } from "./StrokeIcon";
import { TextIcon } from "./TextIcon";
import { MenuOption } from "./MenuOption";

export function RoomCanvas({ roomId }: { roomId: number }) {
  const [tool, setTool] = useState<Shapes>("pointer");
  const [selectedStrokeWidth, setStrokeWidth] = useState<number>(1);
  const [selectedStrokeColor, setStrokeColor] = useState<string>("#d3d3d3");
  const [selectedBgColor, setBgColor] = useState<string>("#121212");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<Engine>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isThemeDark, setIsThemeDark] = useState<boolean>(true);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

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
    setShowClearConfirm(true);
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
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#23232a] text-white rounded-lg shadow-lg p-8 flex flex-col items-center pointer-events-auto">
            <span className="text-lg mb-4">
              Are you sure you want to clear the canvas? This action cannot be
              undone.
            </span>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (engine) {
                    engine.clearLocalStorage();
                    engine.existingShapes = [];
                    engine.clearCanvas();
                    console.log("Canvas cleared");
                  }
                  setShowClearConfirm(false);
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed flex justify-between w-screen top-8 px-6 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-[#23232a] backdrop-blur-sm rounded-lg py-2 px-3 flex items-center justify-center text-white hover:cursor-pointer"
        >
          <Menu />
        </button>
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
        <div className="fixed px-4 py-4 ml-4 bg-[#23232a] text-white rounded-md top-32 z-7">
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

      {isMenuOpen && (
        <div className="fixed px-2 py-4 ml-4 bg-[#23232a] text-white rounded-md top-20 z-10 w-54 h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="border-b pb-4 border-gray-600">
            <MenuOption
              icon={<Command size={17} />}
              heading="Command Palette"
            />
            <MenuOption
              icon={<Trash size={17} />}
              heading="Clear Canvas"
              onClick={handleClear}
            />
            <MenuOption
              icon={<Download size={17} />}
              heading="Import Drawing"
            />
            <MenuOption icon={<Upload size={17} />} heading="Export Drawing" />
            <MenuOption
              icon={<Share2 size={17} />}
              heading="Live Collaboration"
            />
          </div>
          <div className="pt-4 border-b px-2 pb-4 border-gray-600">
            <div className="flex justify-between">
              <span className="text-sm">Theme</span>
              <div className="flex gap-0 border-[#a7a5ff]">
                <button
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setIsThemeDark(!isThemeDark);
                  }}
                >
                  {isThemeDark ? (
                    <IconBrightnessUp size={19} color="#a7a5ff" />
                  ) : (
                    <IconMoon size={19} color="#a7a5ff" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex-col mt-2">
              <span className="text-sm">Canvas Background</span>
              <div>
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
              </div>
              <div className="flex p-2 gap-2 mt-2 bg-[#343a40] rounded-md">
                <span>#</span>
                <input
                  type="text"
                  placeholder={selectedBgColor.slice(1)}
                  className="w-full outline-none focus:outline-none"
                  onBlur={(e) => setBgColor(`#${e.target.value}`)}
                />
              </div>
            </div>
          </div>
          {/* social links */}
          <div className="pt-4">
            <MenuOption
              icon={<IconBrandGithub size={17} />}
              heading="Github"
              theme="bg-[#ffe59a] hover:bg-[#ffe59a] text-black"
              onClick={() =>
                (window.location.href =
                  "https://github.com/dakshydv/infinidraw")
              }
            />
            <MenuOption
              icon={<IconBrandX size={17} />}
              heading="Twitter / X"
              onClick={() => (window.location.href = "https://x.com/dakshydv_")}
            />
            <MenuOption
              icon={<IconWorld size={17} />}
              heading="Portfolio"
              onClick={() => (window.location.href = "https://dakshyadav.com")}
            />
            <MenuOption
              icon={<IconBrandLinkedinFilled size={17} />}
              heading="LinkedIn"
              onClick={() =>
                (window.location.href =
                  "https://www.linkedin.com/in/daksh-dev/")
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
