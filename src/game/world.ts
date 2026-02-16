import type { ThemeKey } from "./types";
import type { PlayerSim, Viewport } from "./types";
import { clamp } from "./math";
import { derive } from "./constants";
import type { Input, } from "./keyboard";


export const makePlayer = (vp:Viewport):PlayerSim => ({
    pos:{ x: vp.w*0.2, y: vp.h*0.55 }, vel:{ x:0, y:0 },
    grounded:false, jumpsLeft:2, crawling:false, sprinting:false,
});

export const groundY = (vp:Viewport)=> vp.h*0.78;
export const stepGround = (p:PlayerSim, vp:Viewport, ph:number) => {
    const gy = groundY(vp);
    if (p.pos.y + ph >= gy) { p.pos.y = gy - ph; p.vel.y = 0; p.grounded = true; p.jumpsLeft = 2; }
    else p.grounded = false;
};

export const playerSize = (vp:Viewport)=>({ w: vp.w*0.045, h: vp.h*0.11 });

export const simulatePlayer = (p:PlayerSim, input:Input, vp:Viewport, dt:number, backstopX:number) => {
  const { run, g, jump } = derive(vp); const sz = playerSize(vp);
  p.crawling = input.down; p.sprinting = input.shift && !p.crawling;
  const speed = run * (p.sprinting?1.55:p.crawling?0.55:1.0);
  const ax = (input.right?1:0) - (input.left?1:0);
  p.vel.x = ax * speed;
  if (input.jump && (p.grounded || p.jumpsLeft>0)) { p.vel.y = -jump; if(!p.grounded) p.jumpsLeft--; }
  p.vel.y += g * dt;
  p.pos.x = clamp( p.pos.x + p.vel.x * dt,backstopX, Infinity);
  p.pos.y = p.pos.y + p.vel.y * dt;
  stepGround(p, vp, sz.h);
};


export const checkpointIndex = (playerX:number, vp:Viewport) =>
  Math.floor(playerX / vp.w);

export const checkpointX = (index:number, vp:Viewport) =>
  index * vp.w;


const themes: ThemeKey[] = ["default"];
export const themeForCheckpoint = (i:number) => themes[i];// Add on later leave it like this for now.

