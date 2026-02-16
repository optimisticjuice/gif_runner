import { useEffect, useRef } from "react";
import type { PlayerSim, GameState } from "./types";
import type { Input } from "./keyboard";
import { simulatePlayer, checkpointIndex, checkpointX, themeForCheckpoint } from "./world";
import type { Action } from "./reducer";

export const useGameLoop = (
  state: GameState,
  playerRef: React.RefObject<PlayerSim>,
  inputRef: React.RefObject<Input>,
  dispatch: React.Dispatch<Action>,
  prevCheckpointRef: React.RefObject<number>,
  setRenderTick: React.Dispatch<React.SetStateAction<number>>
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
      // 1. UPDATE PHYSICS
      simulatePlayer(p, inputRef.current, state.viewport, dt, state.backstopX);

      // 2. CHECKPOINT LOGIC
      const idx = checkpointIndex(p.pos.x, state.viewport);
      if (idx > prevCheckpointRef.current) {
        prevCheckpointRef.current = idx;
        const newBackstopX = checkpointX(idx, state.viewport);
        
        // FAIL PREVIOUSLY: We were resetting player to absolute 20% of viewport (e.g., 400px).
        // If the current checkpoint starts at 2000px, 400px is way BEHIND the screen, making player disappear.
        // FIX: Reset player relative to the NEW checkpoint's start line.
        dispatch({ 
          type: "CHECKPOINT", 
          index: idx, 
          backstopX: newBackstopX, 
          themeKey: themeForCheckpoint(idx) 
        });
        
        p.pos.x = newBackstopX + (state.viewport.w * 0.2);
        p.vel.x = 0;
        p.vel.y = 0;
      }
      
      // 3. SYNCHRONIZE RENDER
      // FAIL PREVIOUSLY: React re-renders were unsynchronized with the physics loop.
      // Sometimes React would draw the player at the "old" position (far right) before the reset finished.
      // FIX: Trigger setRenderTick AFTER all physics/reset logic is done for the frame.
      setRenderTick(t => t + 1);
      
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); t.current = null; };
  }, [state.mode, state.viewport, state.backstopX, dispatch, playerRef, inputRef, prevCheckpointRef]);
};
