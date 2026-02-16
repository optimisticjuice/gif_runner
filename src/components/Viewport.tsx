    import { useEffect } from "react";
import type { Viewport } from "../game/types";
import type { Action } from "../game/reducer";

export function useViewport(dispatch: React.Dispatch<Action>) {
  useEffect(() => {
    const read = ():Viewport => ({ w: innerWidth, h: innerHeight, dpr: devicePixelRatio || 1 });
    const on = () => dispatch({ type:"SET_VIEWPORT", viewport: read() });
    on(); addEventListener("resize", on); addEventListener("orientationchange", on);
    return () => { removeEventListener("resize", on); removeEventListener("orientationchange", on); };
  }, [dispatch]);
}
