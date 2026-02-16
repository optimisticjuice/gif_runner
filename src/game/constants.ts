import type { Viewport } from "./types";
// Keeps things in proportion
export const derive = (vp: Viewport) => {
  const U = Math.min(vp.w, vp.h);
  return { U, g: 2.4 * vp.h, run: 1.1 * vp.w, jump: 1.05 * vp.h };
};
