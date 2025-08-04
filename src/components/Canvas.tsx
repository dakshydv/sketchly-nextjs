"use client";
import { useEffect, useRef, useState } from "react";
import { Engine } from "@/canvas-engine/engine";
import { Shapes } from "../config/types";

export function Canvas({
  roomId,
  socket,
  tool,
  bgColor,
  strokeColor,
}: {
  roomId: number;
  socket?: WebSocket;
  tool: Shapes;
  bgColor: string;
  strokeColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<Engine>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set initial dimensions and handle window resize
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
      const newEngine = new Engine(
        canvasRef.current,
        roomId,
        bgColor,
        strokeColor,
        socket
      );
      setEngine(newEngine);

      return () => {
        newEngine.cleanup();
      };
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (engine) {
      engine.setTool(tool);
    }
  }, [tool, engine]);

  useEffect(() => {
    console.log(`changing bg color to ${bgColor}`);
    engine?.setBgColor(bgColor);
  }, [bgColor]);

  useEffect(() => {
    console.log(`changing stroke color to ${strokeColor}`);
    
    engine?.setStrokeColor(strokeColor);
  }, [strokeColor]);

  return (
    <canvas
      ref={canvasRef}
      height={dimensions.height}
      width={dimensions.width}
    ></canvas>
  );
}
