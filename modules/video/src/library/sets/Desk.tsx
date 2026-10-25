// Desk.tsx: a desk seen from your chair (first person), in world coordinates: a dark wall, a lamp's pool of light on
// the desk top (y 1040 down). Put what's on the desk (buttons, a phone, a letter) and your hands in children.
import React from "react";
import { OUT } from "../style";
import { Glow } from "../ui/Frame";

export const Desk: React.FC<{ lamp?: number; children?: React.ReactNode }> = ({ lamp = 1, children }) => (
  <g {...OUT}>
    <rect x={-900} y={-900} width={2900} height={3800} fill="#1C2030" stroke="none" />
    <rect x={-900} y={980} width={2900} height={60} fill="#151824" stroke="none" />
    <path d="M -300 1040 L 1380 1040 L 1900 2600 L -820 2600 Z" fill="#6B4F3A" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${-220 + i * 60} ${1090 + i * 140} L ${1300 - i * 60} ${1090 + i * 140}`} stroke="#5A4231" strokeWidth={3} opacity={.6} />)}
    <Glow id="desk-lamp" x={540} y={1250} r={760} color="#FFE0A8" a={.45 * lamp} />
    {children}
  </g>
);
