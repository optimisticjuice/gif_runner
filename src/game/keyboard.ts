import { useEffect } from "react";

export type Input = { left:boolean; right:boolean; jump:boolean; down:boolean; shift:boolean };
export const emptyInput = ():Input => ({ left:false,right:false,jump:false,down:false,shift:false });
export const keyOf = (k:string)=>(
  k==="ArrowLeft"?"left":k==="ArrowRight"?"right":k==="ArrowUp"?"jump":k==="ArrowDown"?"down":k==="Shift"?"shift":null
);


export const useKeyboard = (inputRef: React.RefObject<Input>) => {
  useEffect(() => {
    const on = (e:KeyboardEvent, v:boolean)=>{ const k=keyOf(e.key); 
        if(k) inputRef.current[k]=v; };
    const down = (e:KeyboardEvent)=>on(e,true), up=(e:KeyboardEvent)=>on(e,false);
    addEventListener("keydown", down); addEventListener("keyup", up);
    return ()=>{ removeEventListener("keydown", down); removeEventListener("keyup", up); };
  }, [inputRef]);
};
