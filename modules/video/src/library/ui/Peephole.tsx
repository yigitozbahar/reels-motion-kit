// Peephole.tsx: look through a door's peephole: whatever is inside is shown through a round hole in the dark, its edge
// bending away into shadow, a brass rim. open 0..1 grows the hole from nothing (the eye arriving at it).
import React from "react";
import { AbsoluteFill } from "remotion";
import { ease } from "../../lib/anim";

export const Peephole: React.FC<{ open?: number; x?: number; y?: number; r?: number; children: React.ReactNode }> = ({ open = 1, x = 540, y = 880, r = 440, children }) => {
  const R = r * ease(open);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0A0F" }}>
      <AbsoluteFill style={{ clipPath: `circle(${R}px at ${x}px ${y}px)` }}>
        {children}
        <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, transparent ${R * .62}px, rgba(8,6,12,.55) ${R * .9}px, rgba(8,6,12,.95) ${R}px)` }} />
      </AbsoluteFill>
      {R > 4 && <div style={{ position: "absolute", left: x - R - 8, top: y - R - 8, width: 2 * R + 16, height: 2 * R + 16, borderRadius: "50%", border: "8px solid #5A4628", boxSizing: "border-box" }} />}
    </AbsoluteFill>
  );
};
