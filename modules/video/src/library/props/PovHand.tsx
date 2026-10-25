// PovHand.tsx: your own hand, from your eyes (first person), reaching in from the bottom of the frame. An SVG <g> in
// world coordinates: (x, y) is where the fingertips grip (a lock's thumb-turn, a handle), angle tilts the wrist.
//   grip 0..1   the fingers close
import React from "react";
import { OUT } from "../style";

const SKIN = "#D9AE8E", SLEEVE = "#3B4256";

export const PovHand: React.FC<{ x: number; y: number; angle?: number; grip?: number; scale?: number }> = ({ x, y, angle = 0, grip = 1, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI}) scale(${scale})`} {...OUT}>
    <path d="M -70 120 L 70 120 L 120 700 L -150 700 Z" fill={SLEEVE} />
    <path d="M -80 130 Q -95 40 -60 -10 L 60 -10 Q 95 40 80 130 Z" fill={SKIN} />
    {[-42, -14, 14, 42].map((dx, i) => <rect key={i} x={dx - 13} y={-60 + 20 * grip + Math.abs(dx) * .4} width={26} height={70 - 18 * grip} rx={13} fill={SKIN} />)}
    <path d={`M -78 70 Q -120 ${10 + 20 * grip} ${-70 + 30 * grip} -20`} fill="none" stroke={OUT.stroke} strokeWidth={42} />
    <path d={`M -78 70 Q -120 ${10 + 20 * grip} ${-70 + 30 * grip} -20`} fill="none" stroke={SKIN} strokeWidth={30} />
  </g>
);
