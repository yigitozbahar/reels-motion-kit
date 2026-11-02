// Frame.tsx: the camera and the full-frame layers every shot uses.
//   <Cam x y zoom rot>   puts the world point (x, y) at the centre of the frame, zoomed (the world is 1080×1920, drawn
//                        in an <svg> that may spill past its edges)
//   <World>              that svg: draw sets and characters in it in world coordinates
//   <Fill color a>       a flat colour over everything (fades to black, flashes, tints)
//   <Grain t> <Vignette> the film look: a grain that changes every frame, dark corners
import React from "react";
import { AbsoluteFill } from "remotion";
import { H, W } from "../style";

export const Cam: React.FC<{ x?: number; y?: number; zoom?: number; rot?: number; children: React.ReactNode }> = ({ x = W / 2, y = H / 2, zoom = 1, rot = 0, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) rotate(${rot}rad) scale(${zoom}) translate(${-x}px, ${-y}px)` }}>
      {children}
    </div>
  </AbsoluteFill>
);

export const World: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>
);

export const Fill: React.FC<{ color?: string; a: number }> = ({ color = "#0B0A0F", a }) =>
  a > .005 ? <AbsoluteFill style={{ backgroundColor: color, opacity: Math.min(1, a) }} /> : null;

export const Grain: React.FC<{ t: number; a?: number }> = ({ t, a = .09 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: a }}>
    <svg width={W} height={H}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} seed={Math.floor(t * 12) % 16} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

export const Vignette: React.FC<{ a?: number }> = ({ a = .55 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 75% 60% at 50% 45%, transparent 55%, rgba(5,4,8,${a}) 100%)` }} />
);

// a soft light, for lamps, screens, the gap under a door: a radial gradient that fades to nothing
export const Glow: React.FC<{ id: string; x: number; y: number; r: number; color: string; a?: number }> = ({ id, x, y, r, color, a = 1 }) => (
  <>
    <defs><radialGradient id={id}><stop offset="0" stopColor={color} stopOpacity={.85 * a} /><stop offset=".45" stopColor={color} stopOpacity={.3 * a} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} stroke="none" />   {/* no outline even inside an OUT group */}
  </>
);

// a depth layer for 2.5D moves: one camera move (x, y, zoom) seen by layers at different depths. depth < 1 is farther
// (it moves and zooms less), > 1 nearer; stack them far to near.
export const Layer: React.FC<{ x: number; y: number; zoom: number; depth?: number; children: React.ReactNode }> = ({ x, y, zoom, depth = 1, children }) => (
  <Cam x={W / 2 + (x - W / 2) * depth} y={H / 2 + (y - H / 2) * depth} zoom={1 + (zoom - 1) * depth}><World>{children}</World></Cam>
);
