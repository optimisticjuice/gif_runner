export type Vec2 = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type GameMode = "menu" | "playing" | "paused";
export type ThemeKey = "default" | "neon" | "retro" | "nature"; // Later Add On (ThemeKey)
export type Viewport = { w: number; h: number; dpr: number };

export type GameState = {
  mode: GameMode; viewport: Viewport;
  coins: number; checkpointIndex: number; backstopX: number;
  themeKey: ThemeKey; topGifUrl?: string; floorGifUrl?: string;
};

export type PlayerSim = {
  pos: Vec2; vel: Vec2;
  grounded: boolean; jumpsLeft: number;
  crawling: boolean; sprinting: boolean;
};
