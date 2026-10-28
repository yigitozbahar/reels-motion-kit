// Bangle.tsx: a plain gold bangle seen at a slant (an ellipse with a highlight), and an optional glint. A world-coordinate
// <g>: (x, y) its centre, r its radius, tilt how flat it looks (1: a circle, small: edge-on), angle its rotation (radians).
//   glint 0..1   a four-pointed sparkle on its rim
//   part         'all' | 'back' | 'front': on a wrist, draw the back half before the arm and the front half after it, so
//                the arm hides the back of the ring (the halves split along the long axis; the front is the +y side)
import React from "react";
import { OUT } from "../style";

export const Bangle: React.FC<{ x: number; y: number; r?: number; tilt?: number; angle?: number; glint?: number; part?: "all" | "back" | "front" }> = ({ x, y, r = 60, tilt = .35, angle = 0, glint = 0, part = "all" }) => {
  const ry = r * tilt, w = r * .34;
  const arc = part === "back" ? `M ${-r} 0 A ${r} ${ry} 0 0 1 ${r} 0` : part === "front" ? `M ${r} 0 A ${r} ${ry} 0 0 1 ${-r} 0` : null;
  const shine = part === "front" ? `M ${r * .8} ${ry * .55} Q 0 ${ry * 1.25} ${-r * .8} ${ry * .55}` : `M ${-r * .8} ${-ry * .55} Q 0 ${-ry * 1.25} ${r * .8} ${-ry * .55}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI})`}>
      {arc ? (
        <>
          <path d={arc} fill="none" stroke={OUT.stroke} strokeWidth={w + 10} />
          <path d={arc} fill="none" stroke={part === "back" ? "#9C7428" : "#C99A3C"} strokeWidth={w} />
        </>
      ) : (
        <>
          <ellipse cx={0} cy={0} rx={r} ry={ry} fill="none" stroke={OUT.stroke} strokeWidth={w + 10} />
          <ellipse cx={0} cy={0} rx={r} ry={ry} fill="none" stroke="#C99A3C" strokeWidth={w} />
        </>
      )}
      {part !== "back" && <path d={shine} fill="none" stroke="#F4D78A" strokeWidth={r * .1} strokeLinecap="round" />}
      {glint > 0 && part !== "back" && (
        <g transform={`translate(${r * .55} ${(part === "front" ? 1 : -1) * ry * .9}) scale(${.4 + .8 * glint})`} opacity={glint}>
          <path d="M 0 -60 Q 6 -6 60 0 Q 6 6 0 60 Q -6 6 -60 0 Q -6 -6 0 -60 Z" fill="#FFF8DC" />
        </g>
      )}
    </g>
  );
};
