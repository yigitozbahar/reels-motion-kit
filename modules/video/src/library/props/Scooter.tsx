// Scooter.tsx: a small step-through scooter seen from the side, facing left: a front shield, a round headlight on the
// bars, a floorboard, a rounded body over the back wheel, a seat. No brand.
//   (x, y) the ground under its middle; s its scale (1: about 780 px long, 720 high); color its body
//   light 0..1 the headlight
import React from "react";
import { OUT, RED } from "../style";
import { Glow } from "../ui/Frame";

export const Scooter: React.FC<{ x: number; y: number; s?: number; color?: string; shade?: string; light?: number }> = ({ x, y, s = 1, color = "#F1EEE6", shade = "#CFCBC0", light = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={400} ry={28} fill="#000" opacity={.45} />
    <g {...OUT}>
      {[-290, 250].map((cx) => (
        <g key={cx}><circle cx={cx} cy={-85} r={85} fill="#1E1C22" /><circle cx={cx} cy={-85} r={36} fill="#B9BDC6" /></g>
      ))}
      <path d="M -290 -85 L -250 -560" stroke="#7A7F8A" strokeWidth={16} />
      <path d="M -380 -110 Q -290 -215 -200 -120 L -215 -104 Q -290 -180 -365 -100 Z" fill={color} />
      <rect x={-205} y={-150} width={290} height={42} rx={10} fill={shade} />
      <path d="M 60 -150 Q 60 -330 200 -370 L 330 -370 Q 410 -340 400 -200 Q 395 -140 360 -110 L 335 -110 A 85 85 0 0 0 165 -110 L 60 -110 Z" fill={color} />
      <path d="M 120 -300 Q 220 -330 340 -320" fill="none" stroke={shade} strokeWidth={8} />
      <path d="M -200 -108 L -205 -150 Q -232 -380 -272 -560 L -214 -576 Q -164 -380 -140 -150 L -138 -108 Z" fill={color} />
      <rect x={385} y={-275} width={20} height={34} rx={5} fill={RED} />
      <path d="M 160 -370 Q 240 -408 352 -388 Q 372 -374 350 -362 L 170 -362 Z" fill="#4A3E3A" />
      <path d="M -232 -636 L -212 -722" strokeWidth={7} fill="none" />
      <circle cx={-210} cy={-732} r={16} fill="#B9BDC6" />
      <rect x={-330} y={-648} width={160} height={44} rx={18} fill={color} />
      <rect x={-176} y={-640} width={40} height={26} rx={10} fill="#2A2830" />
      <circle cx={-322} cy={-600} r={36} fill="#B9BDC6" />
      <circle cx={-328} cy={-600} r={24} fill={light > .05 ? "#FFF7DA" : "#E6E1D2"} />
    </g>
    {light > 0 && <Glow id="scooter-lamp" x={-328} y={-600} r={200} color="#FFF0C0" a={light} />}
  </g>
);
