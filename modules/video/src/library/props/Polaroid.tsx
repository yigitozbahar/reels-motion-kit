// Polaroid.tsx: an instant photo: a white frame, the picture (children, drawn in 0..500 × 0..500), a handwritten
// caption under it. A world-coordinate <g>: (x, y) its centre, angle its tilt (radians), s its scale.
//   cross 0..1   a red X is drawn over the picture, stroke by stroke: not this one
import React from "react";
import { clamp } from "../../lib/anim";
import { CAVEAT, INK, OUT, RED } from "../style";

const XL = 650;   // the length of one stroke of the X

export const Polaroid: React.FC<{ x: number; y: number; angle?: number; s?: number; caption?: string; cross?: number; children?: React.ReactNode }> = ({ x, y, angle = 0, s = 1, caption, cross = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI}) scale(${s})`}>
    <rect x={-290} y={-330} width={580} height={680} rx={10} fill="#F6F2E8" {...OUT} />
    <svg x={-250} y={-290} width={500} height={500} viewBox="0 0 500 500" overflow="hidden">{children}</svg>
    <rect x={-250} y={-290} width={500} height={500} fill="none" stroke={INK} strokeWidth={4} />
    {caption && <text x={0} y={290} textAnchor="middle" fontFamily={CAVEAT} fontSize={66} fill="#2B2530">{caption}</text>}
    {[[-230, -270, 230, 190, clamp(cross * 2)], [230, -270, -230, 190, clamp(cross * 2 - 1)]].map(([x0, y0, x1, y1, k], i) => k > 0 && (
      <path key={i} d={`M ${x0} ${y0} L ${x1} ${y1}`} stroke={RED} strokeWidth={30} strokeLinecap="round" strokeDasharray={XL} strokeDashoffset={XL * (1 - k)} fill="none" />
    ))}
  </g>
);
