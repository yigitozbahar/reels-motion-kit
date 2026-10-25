// BigButton.tsx: a big push button on a square base, seen from the front and a little above. An SVG <g> in world
// coordinates: (x, y) is the centre of the cap's top, r its radius.
//   color      the cap's colour · glow 0..1 lights it up · press 0..1 pushes it down into the base
//   icon       what pressing it stands for, on the base's front: 'one' (a single figure) | 'many' (a crowd)
import React from "react";
import { OUT } from "../style";
import { Glow } from "../ui/Frame";

export const Figure: React.FC<{ x: number; y: number; s: number; color: string }> = ({ x, y, s, color }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color} stroke="none">
    <circle cx={0} cy={-34} r={13} />
    <path d="M -20 0 Q -20 -20 0 -20 Q 20 -20 20 0 Z" />
  </g>
);

export const BigButton: React.FC<{ id: string; x: number; y: number; r: number; color: string; glow?: number; press?: number; icon?: "one" | "many" }> = ({ id, x, y, r, color, glow = 0, press = 0, icon }) => {
  // the base stays put; the cap sits on its top face (its rim never reaches the front face) and sinks when pressed
  const seat = y + r * .45, top = y + r * .33 * press, bw = r * 2.7, back = seat - r * .32, front = seat + r * .5, face = r * 1.0, icy = front + face * .86;
  return (
    <g {...OUT}>
      {glow > 0 && <Glow id={`btn-${id}`} x={x} y={top} r={r * 3.2} color={color} a={glow} />}
      {/* the base: its top face, its front face with the icon of what pressing it stands for */}
      <path d={`M ${x - bw / 2} ${front} L ${x + bw / 2} ${front} L ${x + bw / 2 - r * .25} ${back} L ${x - bw / 2 + r * .25} ${back} Z`} fill="#3A3F4E" />
      <rect x={x - bw / 2} y={front} width={bw} height={face} rx={10} fill="#2B2F3B" />
      {icon === "one" && <Figure x={x} y={icy} s={r / 60} color="#C9CED6" />}
      {icon === "many" && [-1.2, 1.2, 0].map((d, i) => <Figure key={i} x={x + d * r * .32} y={icy - (d === 0 ? 0 : r * .05)} s={(d === 0 ? 1 : .8) * r / 60} color={d === 0 ? "#C9CED6" : "#8D93A0"} />)}
      {/* the cap: its side (down to the seat), then its top */}
      <path d={`M ${x - r} ${top} L ${x - r} ${seat} A ${r} ${r * .38} 0 0 0 ${x + r} ${seat} L ${x + r} ${top} Z`} fill={color} filter="brightness(.7)" />
      <ellipse cx={x} cy={top} rx={r} ry={r * .38} fill={color} />
      <ellipse cx={x - r * .3} cy={top - r * .08} rx={r * .35} ry={r * .1} fill="#FFFFFF" opacity={.25 + .35 * glow} stroke="none" />
    </g>
  );
};
