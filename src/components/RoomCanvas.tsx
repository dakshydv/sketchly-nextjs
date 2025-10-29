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
  MousePointer,
  MoveRight,
  Pencil,
  Plus,
  Pointer,
  RectangleHorizontal,
  Share2,
  Trash,
  Upload,
  X,
} from "lucide-react";
import {
  FontSizeType,
  Shapes,
  shapesMessage,
  strokeStyleType,
} from "@/config/types";
import { ColorPicker } from "./ColorPicker";
import { StrokeIcon } from "./StrokeIcon";
import { TextIcon } from "./TextIcon";
import { MenuOption } from "./MenuOption";
import { SocialLink } from "./SocialLinks";
import { DottedLine } from "./DottedLine";
import { DottedLine2 } from "./DottedLine2";
import { SharpRect } from "./SharpRect";
import { CircularRect } from "./CircularRect";
import FontSize from "./FontSize";

export function RoomCanvas({ roomId }: { roomId: number }) {
  const [tool, setTool] = useState<Shapes>("pointer");
  const [isClient, setIsClient] = useState(false);
  const [selectedStrokeWidth, setStrokeWidth] = useState<number>(1);
  const [selectedStrokeColor, setStrokeColor] = useState<string>("#d3d3d3");
  const [selectedStrokeStyle, setStrokeStyle] =
    useState<strokeStyleType>("simple");
  const [selectedBgColor, setBgColor] = useState<string>("#121212");
  const [selectedRectRadius, setRectRadius] = useState<number>(30);
  const [selectedFontSize, setFontSize] = useState<FontSizeType>("M");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<Engine>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isThemeDark, setIsThemeDark] = useState<boolean>(true);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showShareComingSoon, setShowShareComingSoon] =
    useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState<boolean>(false);
  const [isBottomCanvasOpen, setIsBottomCanvasOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const keyDownEvent = (e: KeyboardEvent) => {
      switch (e.key) {
        case "1":
          setTool("select");
          break;
        case "2":
          setTool("pointer");
          break;
        case "3":
          setTool("rect");
          break;
        case "4":
          setTool("diamond");
          break;
        case "5":
          setTool("ellipse");
          break;
        case "6":
          setTool("line");
          break;
        case "7":
          setTool("pencil");
          break;
        case "8":
          setTool("arrow");
          break;
        case "9":
          setTool("text");
          break;
        case "0":
          setTool("eraser");
          break;
        case "10":
          setTool("eraser");
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", keyDownEvent);
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("keydown", keyDownEvent);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      let existingShapes: shapesMessage[] = [];

      try {
        const shapesData = localStorage.getItem(`shapes_room_${roomId}`);
        if (shapesData) {
          existingShapes = JSON.parse(shapesData);
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
      engine.setTool(tool);
      engine.clearCanvas();
    }
  }, [tool, engine]);

  useEffect(() => {
    engine?.setStrokeStyle(selectedStrokeStyle);
  }, [selectedStrokeStyle]);

  useEffect(() => {
    engine?.setBgColor(selectedBgColor);
  }, [selectedBgColor]);

  useEffect(() => {
    engine?.setStrokeColor(selectedStrokeColor);
  }, [selectedStrokeColor]);

  useEffect(() => {
    engine?.setStrokeWidth(selectedStrokeWidth);
  }, [selectedStrokeWidth]);

  useEffect(() => {
    engine?.setRectRadius(selectedRectRadius);
  }, [selectedRectRadius]);

  useEffect(() => {
    engine?.setFontSize(selectedFontSize);
  }, [selectedFontSize]);

  useEffect(() => {
    engine?.setBgColor(isThemeDark ? "#121212" : "#ffffff");
    engine?.setTheme(isThemeDark ? "dark" : "light");
  }, [isThemeDark]);

  function handleClear() {
    setShowClearConfirm(true);
  }

  function handleZoomIn() {
    const scale = Math.min(zoomLevel * 1.2, 5);
    setZoomLevel(scale);
    if (engine) {
      const centerClientX = window.innerWidth / 2;
      const centerClientY = window.innerHeight / 2;
      engine.setZoomAt(centerClientX, centerClientY, scale);
    }
  }

  function handleZoomOut() {
    const scale = Math.max(zoomLevel / 1.2, 0.1);
    setZoomLevel(scale);
    if (engine) {
      const centerClientX = window.innerWidth / 2;
      const centerClientY = window.innerHeight / 2;
      engine.setZoomAt(centerClientX, centerClientY, scale);
    }
  }

  function handleZoomReset() {
    setZoomLevel(1);
    if (engine) {
      const centerClientX = window.innerWidth / 2;
      const centerClientY = window.innerHeight / 2;
      engine.setZoomAt(centerClientX, centerClientY, 1);
    }
  }

  return (
    <div className="relative w-screen h-screen">
      {tool ? (
        <canvas
          ref={canvasRef}
          height={isClient ? dimensions.height : 0}
          width={isClient ? dimensions.width : 0}
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
          Welcome to Sketchly
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
      {showShareComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#23232a] text-white rounded-lg shadow-lg p-8 flex flex-col items-center pointer-events-auto min-w-[300px]">
            <span className="text-2xl font-bold mb-2">Coming Soon!</span>
            <span className="mb-4 text-center">
              Sharing and collaboration features are coming soon. Stay tuned!
            </span>
            <button
              className="bg-[#a7a5ff] hover:bg-[#7b79c9] text-black px-4 py-2 rounded mt-2"
              onClick={() => setShowShareComingSoon(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="fixed justify-between w-full top-5 px-4 sm:px-6 left-1/2 transform -translate-x-1/2 z-10 hidden sm:flex">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ececf4] text-black"} backdrop-blur-sm rounded-lg h-10 py-2 px-3 flex items-center justify-center hover:cursor-pointer`}
        >
          <Menu />
        </button>
        {/* tools selection */}
        <div
          className={`${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black outline outline-gray-200 "} backdrop-blur-sm h-13 rounded-lg px-5 flex gap-3`}
        >
          <IconButton
            onClick={() => setTool("select")}
            icon={<MousePointer size={18} />}
            theme={
              tool === "select"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={1}
          />
          <IconButton
            onClick={() => setTool("pointer")}
            icon={<Pointer size={18} />}
            theme={
              tool === "pointer"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={2}
          />
          <IconButton
            onClick={() => setTool("rect")}
            icon={<RectangleHorizontal size={15} />}
            theme={
              tool === "rect"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={3}
          />
          <IconButton
            onClick={() => setTool("diamond")}
            icon={<Diamond size={15} />}
            theme={
              tool === "diamond"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={4}
          />
          <IconButton
            onClick={() => setTool("ellipse")}
            icon={<Circle size={15} />}
            theme={
              tool === "ellipse"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={5}
          />
          <IconButton
            onClick={() => setTool("line")}
            icon={<Minus size={18} fill={tool === "line" ? "#FFFFFF" : ""} />}
            theme={
              tool === "line"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={6}
          />
          <IconButton
            onClick={() => setTool("pencil")}
            icon={<Pencil size={15} />}
            theme={
              tool === "pencil"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={7}
          />
          <IconButton
            onClick={() => setTool("arrow")}
            icon={<MoveRight size={18} />}
            theme={
              tool === "arrow"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={8}
          />
          <IconButton
            onClick={() => setTool("text")}
            icon={<TextIcon />}
            theme={
              tool === "text"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={9}
          />
          <IconButton
            onClick={() => setTool("eraser")}
            icon={<Eraser size={15} />}
            theme={
              tool === "eraser"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
            number={10}
          />
        </div>
        <button
          className="bg-[#a7a5ff] px-4 rounded-md h-10 flex items-center justify-center"
          onClick={() => setShowShareComingSoon(true)}
        >
          Share
        </button>
      </div>

      <div className="fixed sm:hidden top-4 left-1/2 -translate-x-1/2 z-10 w-full px-3">
        <div
          className={`${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black outline outline-gray-200"} backdrop-blur-sm rounded-lg h-11 px-3 flex gap-1 overflow-x-auto no-scrollbar`}
        >
          <IconButton
            onClick={() => setTool("select")}
            icon={<MousePointer size={16} />}
            theme={
              tool === "select"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("pointer")}
            icon={<Pointer size={16} />}
            theme={
              tool === "pointer"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("rect")}
            icon={<RectangleHorizontal size={14} />}
            theme={
              tool === "rect"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("diamond")}
            icon={<Diamond size={14} />}
            theme={
              tool === "diamond"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("ellipse")}
            icon={<Circle size={14} />}
            theme={
              tool === "ellipse"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("line")}
            icon={<Minus size={16} fill={tool === "line" ? "#FFFFFF" : ""} />}
            theme={
              tool === "line"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("pencil")}
            icon={<Pencil size={14} />}
            theme={
              tool === "pencil"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("arrow")}
            icon={<MoveRight size={16} />}
            theme={
              tool === "arrow"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("text")}
            icon={<TextIcon />}
            theme={
              tool === "text"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
          <IconButton
            onClick={() => setTool("eraser")}
            icon={<Eraser size={14} />}
            theme={
              tool === "eraser"
                ? `${isThemeDark ? "bg-[#403e6a]" : "bg-[#e0dfff]"}`
                : ""
            }
          />
        </div>
      </div>
      {/* custom options */}
      {tool !== "pointer" && tool !== "eraser" && (
        <div className="hidden sm:block fixed px-4 py-4 ml-4 bg-[#23232a] text-white rounded-md top-32 z-7">
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

          {/* stroke style */}
          <div className={`${tool === "text" ? "hidden" : ""}`}>
            <p className="mt-3">Stroke style</p>
            <div className="mt-1 flex gap-1">
              <StrokeIcon
                onClick={() => setStrokeStyle("simple")}
                strokeWidth={1}
                theme={
                  selectedStrokeStyle === "simple"
                    ? "bg-[#403e6a]"
                    : "bg-[#2e2d39]"
                }
              />
              <DottedLine
                onClick={() => setStrokeStyle("rough")}
                theme={
                  selectedStrokeStyle === "rough"
                    ? "bg-[#403e6a]"
                    : "bg-[#2e2d39]"
                }
              />
              <DottedLine2
                onClick={() => setStrokeStyle("dense")}
                theme={
                  selectedStrokeStyle === "dense"
                    ? "bg-[#403e6a]"
                    : "bg-[#2e2d39]"
                }
              />
            </div>
          </div>

          {/* edges */}
          <div className={`${tool === "rect" ? "" : "hidden"}`}>
            <p className="mt-3">Edges</p>
            <div className="mt-1 flex gap-1">
              <SharpRect
                onClick={() => setRectRadius(0)}
                theme={
                  selectedRectRadius === 0 ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                }
              />
              <CircularRect
                onClick={() => setRectRadius(30)}
                theme={
                  selectedRectRadius === 30 ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                }
              />
            </div>
          </div>

          {/* font size */}
          <div className={`${tool === "text" ? "" : "hidden"}`}>
            <p className="mt-3">Font size</p>
            <div className="mt-1 flex gap-1">
              <FontSize
                text="S"
                onClick={() => setFontSize("S")}
                theme={
                  selectedFontSize === "S" ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                }
              />
              <FontSize
                text="M"
                onClick={() => setFontSize("M")}
                theme={
                  selectedFontSize === "M" ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                }
              />
              <FontSize
                text="L"
                onClick={() => setFontSize("L")}
                theme={
                  selectedFontSize === "L" ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                }
              />
              <FontSize
                text="XL"
                onClick={() => setFontSize("XL")}
                theme={
                  selectedFontSize === "XL" ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop menu */}
      {isMenuOpen && (
        <div
          className={`hidden sm:block fixed px-2 py-4 ml-4 ${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black"} rounded-md top-20 z-10 w-54 h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full`}
        >
          <div
            className={`border-b pb-4 ${isThemeDark ? "border-gray-600" : "border-gray-200"}`}
          >
            <MenuOption
              icon={<Command size={17} />}
              heading="Command Palette"
              theme={isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"}
            />
            <MenuOption
              icon={<Trash size={17} />}
              heading="Clear Canvas"
              onClick={handleClear}
              theme={isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"}
            />
            <MenuOption
              icon={<Download size={17} />}
              heading="Import Drawing"
              theme={isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"}
            />
            <MenuOption
              icon={<Upload size={17} />}
              heading="Export Drawing"
              theme={isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"}
            />
            <MenuOption
              icon={<Share2 size={17} />}
              heading="Live Collaboration"
              theme={isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"}
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
                {isThemeDark && (
                  <div className="mt-1 flex gap-1">
                    <ColorPicker
                      background="bg-[#121212]"
                      border={
                        selectedBgColor === "#121212"
                          ? "border-[#5e96d9]"
                          : "border-white"
                      }
                      onClick={() => setBgColor("#121212")}
                    />
                    <ColorPicker
                      background="bg-[#161718]"
                      border={
                        selectedBgColor === "#161718"
                          ? "border-[#5e96d9]"
                          : "border-white"
                      }
                      onClick={() => setBgColor("#161718")}
                    />
                    <ColorPicker
                      background="bg-[#13171b]"
                      border={
                        selectedBgColor === "#13171b"
                          ? "border-[#5e96d9]"
                          : "border-white"
                      }
                      onClick={() => setBgColor("#13171b")}
                    />
                    <ColorPicker
                      background="bg-[#181604]"
                      border={
                        selectedBgColor === "#181604"
                          ? "border-[#5e96d9]"
                          : "border-white"
                      }
                      onClick={() => setBgColor("#181604")}
                    />
                    <ColorPicker
                      background="bg-[#1b1715]"
                      border={
                        selectedBgColor === "#1b1715"
                          ? "border-[#5e96d9]"
                          : "border-white"
                      }
                      onClick={() => setBgColor("#1b1715")}
                    />
                  </div>
                )}
                {!isThemeDark && (
                  <div className="mt-1 flex gap-1">
                    <ColorPicker
                      background="bg-[#ffffff]"
                      border={
                        selectedBgColor === "#ffffff"
                          ? "border-[#5e96d9]"
                          : "border-gray-200"
                      }
                      onClick={() => setBgColor("#ffffff")}
                    />
                    <ColorPicker
                      background="bg-[#f8f9fa]"
                      border={
                        selectedBgColor === "#f8f9fa"
                          ? "border-[#5e96d9]"
                          : "border-gray-200"
                      }
                      onClick={() => setBgColor("#f8f9fa")}
                    />
                    <ColorPicker
                      background="bg-[#f5fafe]"
                      border={
                        selectedBgColor === "#f5fafe"
                          ? "border-[#5e96d9]"
                          : "border-gray-200"
                      }
                      onClick={() => setBgColor("#fefce8")}
                    />
                    <ColorPicker
                      background="bg-[#fefce8]"
                      border={
                        selectedBgColor === "#fefce8"
                          ? "border-[#5e96d9]"
                          : "border-gray-200"
                      }
                      onClick={() => setBgColor("#fefce8")}
                    />
                    <ColorPicker
                      background="bg-[#fdf8f6]"
                      border={
                        selectedBgColor === "#fdf8f6"
                          ? "border-[#5e96d9]"
                          : "border-gray-200"
                      }
                      onClick={() => setBgColor("#fdf8f6")}
                    />
                  </div>
                )}
              </div>
              <div
                className={`flex p-2 gap-2 mt-2 ${isThemeDark ? "bg-[#343a40]" : "bg-[#e0dfff]"} rounded-md`}
              >
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
            <SocialLink
              icon={<IconBrandGithub size={17} />}
              heading="Github"
              theme={`bg-[#ffe59a] ${isThemeDark ? "hover:bg-[#ffe59a]" : "hover:bg-[#e0dfff]"} text-black`}
              href="https://github.com/dakshydv/sketchly"
            />
            <SocialLink
              icon={<IconBrandX size={17} />}
              heading="Twitter / X"
              href="https://x.com/dakshydv_"
              theme={isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"}
            />
            <SocialLink
              icon={<IconWorld size={17} />}
              heading="Portfolio"
              href="https://dakshyadav.com"
              theme={isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"}
            />
            <SocialLink
              icon={<IconBrandLinkedinFilled size={17} />}
              heading="LinkedIn"
              href="https://www.linkedin.com/in/daksh-dev/"
              theme={isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"}
            />
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="hidden sm:flex fixed bottom-6 left-6 z-10">
        <button
          onClick={handleZoomOut}
          className={`${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black outline outline-gray-200"} backdrop-blur-sm rounded-l-lg h-10 w-10 flex items-center justify-center hover:cursor-pointer `}
        >
          <Minus size={18} />
        </button>
        <button
          onClick={handleZoomReset}
          className={`${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black outline outline-gray-200"} backdrop-blur-sm h-10 px-3 flex items-center justify-center hover:cursor-pointer text-sm font-medium`}
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className={`${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black outline outline-gray-200"} backdrop-blur-sm rounded-r-lg h-10 w-10 flex items-center justify-center hover:cursor-pointer`}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* bottom nav in mobile */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-20 safe-bottom safe-left safe-right pb-6 px-3">
        <div
          className={`${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black outline outline-gray-200"} backdrop-blur-sm rounded-xl h-14 flex items-center justify-between px-3`}
        >
          <button
            onClick={() => {
              setIsBottomCanvasOpen(false);
              setIsBottomMenuOpen((v) => !v);
            }}
            className="rounded-md h-10 w-10 flex items-center justify-center"
          >
            <Menu />
          </button>
          <button
            onClick={() => {
              setIsBottomMenuOpen(false);
              setIsBottomCanvasOpen((v) => !v);
            }}
            className="bg-[#a7a5ff] text-black rounded-md h-10 px-4 text-sm font-medium"
          >
            Canvas
          </button>
          <div className="flex items-center">
            <button
              onClick={handleZoomOut}
              className={`${isThemeDark ? "bg-[#2e2d39] text-white" : "bg-[#ffffff] text-black outline outline-gray-200"} rounded-l-md h-10 w-10 flex items-center justify-center`}
            >
              <Minus size={16} />
            </button>
            <div
              className={`${isThemeDark ? "bg-[#2e2d39] text-white" : "bg-[#ffffff] text-black outline outline-gray-200"} h-10 px-2 flex items-center justify-center text-xs font-medium`}
            >
              {Math.round(zoomLevel * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              className={`${isThemeDark ? "bg-[#2e2d39] text-white" : "bg-[#ffffff] text-black outline outline-gray-200"} rounded-r-md h-10 w-10 flex items-center justify-center`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isBottomMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-30"
          onClick={() => setIsBottomMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className={`${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black"} absolute inset-x-0 bottom-0 rounded-t-2xl p-4 pb-8 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full safe-bottom`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-gray-500/50 mb-3" />
            <div className="w-full flex justify-end">
              {/* <p className="mx-auto text-xl font-semibold">Menu</p> */}
              <button onClick={() => setIsBottomMenuOpen(false)} className="">
                <X />
              </button>
            </div>
            <div
              className={`border-b pb-4 ${isThemeDark ? "border-gray-600" : "border-gray-200"}`}
            >
              <MenuOption
                icon={<Command size={17} />}
                heading="Command Palette"
                theme={
                  isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"
                }
              />
              <MenuOption
                icon={<Trash size={17} />}
                heading="Clear Canvas"
                onClick={handleClear}
                theme={
                  isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"
                }
              />
              <MenuOption
                icon={<Download size={17} />}
                heading="Import Drawing"
                theme={
                  isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"
                }
              />
              <MenuOption
                icon={<Upload size={17} />}
                heading="Export Drawing"
                theme={
                  isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"
                }
              />
              <MenuOption
                icon={<Share2 size={17} />}
                heading="Live Collaboration"
                theme={
                  isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"
                }
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
            </div>
            <div className="pt-4">
              <SocialLink
                icon={<IconBrandGithub size={17} />}
                heading="Github"
                theme={`bg-[#ffe59a] ${isThemeDark ? "hover:bg-[#ffe59a]" : "hover:bg-[#e0dfff]"} text-black`}
                href="https://github.com/dakshydv/sketchly"
              />
              <SocialLink
                icon={<IconBrandX size={17} />}
                heading="Twitter / X"
                href="https://x.com/dakshydv_"
                theme={
                  isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"
                }
              />
              <SocialLink
                icon={<IconWorld size={17} />}
                heading="Portfolio"
                href="https://dakshyadav.com"
                theme={
                  isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"
                }
              />
              <SocialLink
                icon={<IconBrandLinkedinFilled size={17} />}
                heading="LinkedIn"
                href="https://www.linkedin.com/in/daksh-dev/"
                theme={
                  isThemeDark ? "hover:bg-[#31303b]" : "hover:bg-[#e0dfff]"
                }
              />
            </div>
            <div className="h-6" />
          </div>
        </div>
      )}

      {/* Mobile custom options */}
      {isBottomCanvasOpen && (
        <div
          className="sm:hidden fixed inset-0 z-30"
          onClick={() => setIsBottomCanvasOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className={`absolute inset-x-0 bottom-0 pb-20 rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto safe-bottom ${isThemeDark ? "bg-[#23232a] text-white" : "bg-[#ffffff] text-black"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-end">
              <p className="mx-auto text-xl font-semibold">Canvas Styles</p>
              <button onClick={() => setIsBottomCanvasOpen(false)} className="">
                <X />
              </button>
            </div>
            <p className="text-sm">Stroke</p>
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
            <div className={`${tool === "text" ? "hidden" : ""}`}>
              <p className="mt-3">Stroke style</p>
              <div className="mt-1 flex gap-1">
                <StrokeIcon
                  onClick={() => setStrokeStyle("simple")}
                  strokeWidth={1}
                  theme={
                    selectedStrokeStyle === "simple"
                      ? "bg-[#403e6a]"
                      : "bg-[#2e2d39]"
                  }
                />
                <DottedLine
                  onClick={() => setStrokeStyle("rough")}
                  theme={
                    selectedStrokeStyle === "rough"
                      ? "bg-[#403e6a]"
                      : "bg-[#2e2d39]"
                  }
                />
                <DottedLine2
                  onClick={() => setStrokeStyle("dense")}
                  theme={
                    selectedStrokeStyle === "dense"
                      ? "bg-[#403e6a]"
                      : "bg-[#2e2d39]"
                  }
                />
              </div>
            </div>
            <div className={`${tool === "rect" ? "" : "hidden"}`}>
              <p className="mt-3">Edges</p>
              <div className="mt-1 flex gap-1">
                <SharpRect
                  onClick={() => setRectRadius(0)}
                  theme={
                    selectedRectRadius === 0 ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                  }
                />
                <CircularRect
                  onClick={() => setRectRadius(30)}
                  theme={
                    selectedRectRadius === 30 ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                  }
                />
              </div>
            </div>
            <div className={`${tool === "text" ? "" : "hidden"}`}>
              <p className="mt-3">Font size</p>
              <div className="mt-1 flex gap-1">
                <FontSize
                  text="S"
                  onClick={() => setFontSize("S")}
                  theme={
                    selectedFontSize === "S" ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                  }
                />
                <FontSize
                  text="M"
                  onClick={() => setFontSize("M")}
                  theme={
                    selectedFontSize === "M" ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                  }
                />
                <FontSize
                  text="L"
                  onClick={() => setFontSize("L")}
                  theme={
                    selectedFontSize === "L" ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                  }
                />
                <FontSize
                  text="XL"
                  onClick={() => setFontSize("XL")}
                  theme={
                    selectedFontSize === "XL" ? "bg-[#403e6a]" : "bg-[#2e2d39]"
                  }
                />
              </div>
            </div>
            <div className="h-8" />
          </div>
        </div>
      )}
    </div>
  );
}
