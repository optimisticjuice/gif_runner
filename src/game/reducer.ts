import type { GameState, Viewport, ThemeKey } from "./types";
export type Action =
 | { type:"SET_VIEWPORT"; viewport:Viewport }
 | { type:"START" } | { type:"PAUSE" } | { type:"RESUME" }
 | { type:"CHECKPOINT"; index:number; backstopX:number; themeKey:ThemeKey }
 | { type:"COIN" } | { type:"THEME_URLS"; top?:string; floor?:string };


 export const initial = (viewport:Viewport):GameState => ({
  mode:"menu", viewport, coins:0, checkpointIndex:0, backstopX:0,
  themeKey:"default", topGifUrl:undefined, floorGifUrl:undefined,
});


export function reducer(s: GameState, a: Action): GameState {
  if (a.type === "SET_VIEWPORT") return { ...s, viewport: a.viewport };
  if (a.type === "START") return { ...s, mode: "playing" };
  if (a.type === "PAUSE") return { ...s, mode: "paused" };
  if (a.type === "RESUME") return { ...s, mode: "playing" };
  if (a.type==="COIN") return { ...s, coins: s.coins + 1 };
  if (a.type==="CHECKPOINT") return {
    ...s, checkpointIndex:a.index, backstopX:a.backstopX, themeKey:a.themeKey
  };
  if (a.type==="THEME_URLS") return { ...s, topGifUrl:a.top, floorGifUrl:a.floor };

  return s;
}
