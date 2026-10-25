// Stairwell.tsx: the landing outside a flat's door, in world coordinates (whoever stands there has their feet at
// x 540, y 1480). The timer light hangs over it, the neighbour's door is on the right, the rail goes down on the left.
//   lamp 0..1   the timer light (it dims, flickers, goes out)
//   children    who stands on the landing, drawn between the set and nothing: pass a character <g>
import React from "react";
import { OUT } from "../style";
import { Glow } from "../ui/Frame";

export const Stairwell: React.FC<{ lamp?: number; children?: React.ReactNode }> = ({ lamp = 1, children }) => (
  <g {...OUT}>
    <rect x={-800} y={-800} width={2700} height={3600} fill="#56685B" stroke="none" />
    <ellipse cx={540} cy={420} rx={760} ry={560} fill="#6A806F" stroke="none" opacity={.4 + .6 * lamp} />
    <rect x={-800} y={1480} width={2700} height={1300} fill="#6B5E57" />
    {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <path key={i} d={`M ${i * 200 - 60} 1484 L ${i * 300 - 330} 2400`} stroke="#4E433D" strokeWidth={3} />)}
    {/* the neighbour's door, its number, its mat */}
    <rect x={930} y={520} width={420} height={960} fill="#5A3E2E" />
    <rect x={1000} y={600} width={280} height={330} rx={12} fill="#4E3527" strokeWidth={4} />
    <circle cx={990} cy={1030} r={17} fill="#C9A54E" />
    <rect x={1080} y={470} width={70} height={36} rx={6} fill="#C9B98E" strokeWidth={3} />
    <text x={1115} y={497} fontSize={26} fontFamily="sans-serif" fontWeight={700} textAnchor="middle" fill="#3A2E24" stroke="none">8</text>
    <rect x={960} y={1468} width={360} height={26} rx={6} fill="#7A3B33" />
    {/* the rail going down on the left */}
    <path d="M -420 1170 L 210 1300" stroke={OUT.stroke} strokeWidth={40} />
    <path d="M -420 1170 L 210 1300" stroke="#3B2E28" strokeWidth={28} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-370 + i * 105} ${1182 + i * 22} L ${-370 + i * 105} 1480`} strokeWidth={10} />)}
    {/* the timer light */}
    <ellipse cx={540} cy={300} rx={80} ry={46} fill={lamp > .5 ? "#F3E7C6" : "#8C8878"} />
    <Glow id="stair-lamp" x={540} y={300} r={600} color="#FFE6B0" a={.55 * lamp} />
    {children}
  </g>
);
