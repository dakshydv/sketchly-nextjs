import { Request } from "express";

export interface UserShapes {
  id: number;
  message: string;
  userId: number;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

export interface request extends Request {
  userId?: number;
}

export type shapes =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "text";
      text: string;
      style: string;
      x: number;
      y: number;
    }
  | {
      type: "diamond";
      xLeft: number;
      xRight: number;
      yHorizontal: number;
      xVertical: number;
      yTop: number;
      yBottom: number;
    }
  | {
      type: "pencil";
      style: string;
      cords: Cords[];
    };

export interface Cords {
  x: number;
  y: number;
}
