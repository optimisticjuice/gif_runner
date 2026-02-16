import { useEffect, useRef } from "react";
import type { PlayerSim, GameState } from "./types";
import type { Input } from "./keyboard";
import { simulatePlayer, checkpointIndex, checkpointX, themeForCheckpoint } from "./world";
import type { Action } from "./reducer";

export const useGameLoop = (
  state: GameState,
  playerRef: React.RefObject<PlayerSim>,
  inputRef: React.RefObject<Input>,
  dispatch: React.Dispatch<Action>
) => {
  const t = useRef<number | null>(null);
  useEffect(() => {
    if (state.mode !== "playing") return;
    let raf = 0;    
    const frame = (now:number) => {
      const prev = t.current ?? now;
      t.current = now;
      const dt = Math.min(0.033, (now - prev) / 1000);
      const p = playerRef.current; 
      simulatePlayer(p, inputRef.current, state.viewport, dt, state.backstopX);
      const idx = checkpointIndex(p.pos.x, state.viewport);
      if (idx > state.checkpointIndex) dispatch({ type:"CHECKPOINT", index: idx, backstopX: checkpointX(idx, state.viewport), themeKey: themeForCheckpoint(idx) });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); t.current = null; };
  }, [state.mode, state.viewport, state.backstopX, state.checkpointIndex, dispatch, playerRef, inputRef]);
};
