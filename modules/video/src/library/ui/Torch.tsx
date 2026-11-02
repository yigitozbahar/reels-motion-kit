// Torch.tsx: the dark with a torch beam in it: everything is black but a soft warm circle at (x, y) in frame pixels.
// Put it over a shot drawn at full light. r is the beam's radius; flicker 0..1 shakes its brightness.
import React from "react";
import { AbsoluteFill } from "remotion";

export const Torch: React.FC<{ x: number; y: number; r?: number; flicker?: number }> = ({ x, y, r = 420, flicker = 0 }) => {
  const k = 1 - flicker * .5;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, rgba(4,4,6,${.05 / k}) ${r * .35}px, rgba(4,4,6,${Math.min(1, .55 / k)}) ${r * .75}px, rgba(4,4,6,.97) ${r}px)` }} />
      <AbsoluteFill style={{ mixBlendMode: "soft-light", background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,226,170,${.35 * k}), transparent ${r * .8}px)` }} />
    </AbsoluteFill>
  );
};
