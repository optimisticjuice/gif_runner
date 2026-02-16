import type { Vec2 } from "./types";
import type { Rect } from "./types";

// ✅  Clamp
export const clamp = (n:number, a:number, b:number)=>Math.max(a, Math.min(b,n));

// ✅ Vec2
export const vAdd = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const vScale = (v: Vec2, s: number): Vec2 => ({ x: v.x * s, y: v.y * s });
export const vCopy = (v: Vec2): Vec2 => ({ x: v.x, y: v.y });

// ✅ Rect
export const rect = (x: number, y: number, w: number, h: number): Rect => ({
  x, y, w, h
});

// ✅ Overlap
export const overlap = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.w &&
  a.x + a.w > b.x &&
  a.y < b.y + b.h &&
  a.y + a.h > b.y;
