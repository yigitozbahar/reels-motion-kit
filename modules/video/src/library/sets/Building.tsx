// Building.tsx: an apartment block at night, from the street, in world coordinates: six floors of four windows, the
// entrance at the bottom, a street lamp. Windows light up with a phone's blue as their people read something.
//   lit      how many windows are lit (0..24, fractional: the next one fades in), in a fixed scattered order
//   yours    the index of your window (always warm-lit), or -1
import React from "react";
import { hash } from "../../lib/anim";
import { OUT } from "../style";
import { Glow } from "../ui/Frame";

const ORDER = Array.from({ length: 24 }, (_, i) => i).sort((a, b) => hash(a * 3.1) - hash(b * 3.1));

export const Building: React.FC<{ lit?: number; yours?: number }> = ({ lit = 0, yours = 9 }) => (
  <g {...OUT}>
    <rect x={-800} y={-800} width={2700} height={3700} fill="#121628" stroke="none" />
    <circle cx={880} cy={260} r={60} fill="#E9E4D0" />
    <Glow id="moon" x={880} y={260} r={260} color="#C9D3F0" a={.4} />
    {/* the block, its roof, the entrance */}
    <rect x={150} y={360} width={780} height={1300} fill="#2B2F3F" />
    <rect x={120} y={330} width={840} height={40} fill="#23263A" />
    <rect x={455} y={1460} width={170} height={200} fill="#4A3A2E" />
    <rect x={430} y={1440} width={220} height={24} fill="#23263A" />
    {ORDER.map((idx, rank) => {
      const col = idx % 4, row = Math.floor(idx / 4), x = 200 + col * 185, y = 410 + row * 175;
      const a = idx === yours ? 1 : Math.max(0, Math.min(1, lit - rank));
      return (
        <g key={idx}>
          <rect x={x} y={y} width={120} height={110} fill={idx === yours ? "#E8C97A" : a > 0 ? `rgba(159,184,255,${.25 + .6 * a})` : "#1A1D2B"} />
          {a > 0 && idx !== yours && <Glow id={`win${idx}`} x={x + 60} y={y + 55} r={110} color="#9FB8FF" a={.5 * a} />}
          <path d={`M ${x + 60} ${y} V ${y + 110}`} strokeWidth={4} />
        </g>
      );
    })}
    {/* the street and a lamp */}
    <rect x={-800} y={1660} width={2700} height={1200} fill="#1E1F27" />
    <path d="M 1000 1660 V 1150" strokeWidth={16} />
    <ellipse cx={985} cy={1140} rx={40} ry={20} fill="#F0D98C" />
    <Glow id="street" x={985} y={1160} r={300} color="#FFD98C" a={.45} />
  </g>
);
