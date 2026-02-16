import { useEffect, useReducer, useRef } from "react";
import { reducer, initial } from "../game/reducer";
import { emptyInput, useKeyboard } from "../game/keyboard";
import { makePlayer } from "../game/world";
import { useGameLoop } from "../game/loop";
import { useViewport } from "./Viewport";

export default function Game() {
  // 1) Reducer state (discrete events + UI state)
  const [state, dispatch] = useReducer(
    reducer,
    { w: innerWidth, h: innerHeight, dpr: devicePixelRatio || 1 },
    initial
  );

  // 2) Keep viewport in sync with window size
  useViewport(dispatch);

  // 3) Input lives in a ref (no re-renders per key press)
  const inputRef = useRef(emptyInput());
  useKeyboard(inputRef);

  // 4) Player physics lives in a ref (no re-renders per frame)
  // IMPORTANT: useRef(initialValue) runs only once, so we reset playerRef manually when needed.
  const playerRef = useRef(makePlayer(state.viewport));

  // 5) Reset player when:
  // - we are in menu (fresh start)
  // - viewport changes while still in menu (spawn should match new screen)
  useEffect(() => {
    if (state.mode === "menu") {
      playerRef.current = makePlayer(state.viewport);
    }
  }, [state.mode, state.viewport]);

  // 6) Main game loop (only runs when state.mode === "playing")
  useGameLoop(state, playerRef, inputRef, dispatch);

  // Controls
  const handleStart = () => dispatch({ type: "START" });
  const handlePause = () =>
    dispatch({ type: state.mode === "playing" ? "PAUSE" : "RESUME" });

  // Convenience: allow keyboard shortcuts for start/pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && state.mode === "menu") handleStart();
      if (e.key === "Escape" && (state.mode === "playing" || state.mode === "paused")) handlePause();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [state.mode]); // safe: we read state.mode only

  // Read player position for rendering (this does NOT re-render every frame by itself)
  // NOTE: You'll see movement when reducer re-renders (checkpoint/coins/viewport changes).
  // Later you can add a tiny "render tick" state if you want smooth visual updates every frame.
  const p = playerRef.current;

  return (
    <div
      className="gameViewport"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "lightblue", // your requirement
        userSelect: "none",
      }}
    >
      {/* SKY BAND (middle) */}
      <div
        className="skyBand"
        style={{
          position: "absolute",
          left: 0,
          top: "35%",
          width: "100%",
          height: "30%",
          background: "lightblue",
          pointerEvents: "none",
        }}
      />

      {/* TOP GIF LAYER (later: set backgroundImage from state.topGifUrl) */}
      <div
        className="topGif"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "35%",
          // backgroundImage: state.topGifUrl ? `url(${state.topGifUrl})` : undefined,
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
          pointerEvents: "none",
        }}
      />

      {/* FLOOR GIF LAYER (later: set backgroundImage from state.floorGifUrl) */}
      <div
        className="floorGif"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "35%",
          // backgroundImage: state.floorGifUrl ? `url(${state.floorGifUrl})` : undefined,
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
          pointerEvents: "none",
        }}
      />

      {/* PLAYER (basic placeholder — visible now) */}
      <div
        className="player"
        style={{
          position: "absolute",
          width: Math.max(16, Math.round(state.viewport.w * 0.045)),
          height: Math.max(28, Math.round(state.viewport.h * 0.11)),
          transform: `translate3d(${p.pos.x}px, ${p.pos.y}px, 0)`,
          background: "black",
          borderRadius: 8,
        }}
        title={`x:${p.pos.x.toFixed(1)} y:${p.pos.y.toFixed(1)}`}
      />

      {/* HUD */}
      <div className="hud layer-hud" style={{ position: "absolute", left: 12, top: 12 }}>
        <div className="hudPanel">
          <div className="hudLabel">Mode</div>
          <div className="hudValue">{state.mode}</div>
        </div>

        <div className="hudPanel">
          <div className="hudLabel">Coins</div>
          <div className="hudValue">{state.coins}</div>
        </div>

        <div className="hudPanel">
          <div className="hudLabel">Checkpoint</div>
          <div className="hudValue">{state.checkpointIndex}</div>
        </div>

        <div className="hudPanel">
          <div className="hudLabel">Controls</div>
          <div className="hudPills" style={{ display: "flex", gap: 8 }}>
            {state.mode === "menu" && (
              <button className="pill pill--accent" onClick={handleStart}>
                Start (Enter)
              </button>
            )}
            {(state.mode === "playing" || state.mode === "paused") && (
              <button className="pill pill--accent" onClick={handlePause}>
                {state.mode === "playing" ? "Pause (Esc)" : "Resume (Esc)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
