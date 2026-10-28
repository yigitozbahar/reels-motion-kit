// KeyFob.tsx: a vehicle's remote key: a black fob on a ring, one big button with a light symbol, a little LED. An SVG
// <g> in world coordinates: (x, y) the button's centre; about 140×300 px at scale 1.
//   press 0..1   the button goes in
//   led 0..1     the LED lights red
import React from "react";
import { CREAM, OUT, RED } from "../style";

export const KeyFob: React.FC<{ x: number; y: number; angle?: number; scale?: number; press?: number; led?: number }> = ({ x, y, angle = 0, scale = 1, press = 0, led = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI}) scale(${scale})`} {...OUT}>
    <circle cx={0} cy={-170} r={46} fill="none" strokeWidth={16} />
    <circle cx={0} cy={-170} r={46} fill="none" stroke="#C9CED8" strokeWidth={8} />
    <rect x={-70} y={-130} width={140} height={250} rx={60} fill="#232129" />
    <rect x={-46} y={-112} width={92} height={24} rx={12} fill="#3A3742" stroke="none" />
    <circle cx={0} cy={-70} r={10} fill={led > .5 ? RED : "#5A2522"} strokeWidth={3} />
    <circle cx={0} cy={0} r={46 - 5 * press} fill={press > .5 ? "#3E3B46" : "#4A4752"} />
    <circle cx={0} cy={0} r={14} fill="none" stroke={CREAM} strokeWidth={5} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i * Math.PI) / 4; return <path key={i} d={`M ${Math.cos(a) * 21} ${Math.sin(a) * 21} L ${Math.cos(a) * 29} ${Math.sin(a) * 29}`} stroke={CREAM} strokeWidth={4} />; })}
  </g>
);
