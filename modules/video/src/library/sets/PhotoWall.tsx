// PhotoWall.tsx: a damp wall hung with framed photos, wider than the frame (x −900..2000). World coordinates.
//   frames    { x, y, w, h, angle?, ribbon?, label?, picture } — picture is drawn in a 200×260 box; ribbon puts a black
//             mourning ribbon across the top-left corner; label is a small line under the frame (a name, years)
import React from "react";
import { hash } from "../../lib/anim";
import { OUT, ROBOTO } from "../style";

export type WallFrame = { x: number; y: number; w: number; h: number; angle?: number; ribbon?: boolean; label?: string; picture: React.ReactNode };

export const PhotoWall: React.FC<{ frames: WallFrame[] }> = ({ frames }) => (
  <g>
    <rect x={-1300} y={-600} width={3800} height={3200} fill="#2E2B26" />
    {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={-1000 + hash(i * 5.3) * 3200} cy={-200 + hash(i * 1.9) * 2400} rx={90 + 160 * hash(i)} ry={60 + 200 * hash(i * 7)} fill="#24221E" opacity={.6} />)}
    {frames.map((f, i) => (
      <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${((f.angle ?? 0) * 180) / Math.PI})`}>
        <rect x={-f.w / 2 - 22} y={-f.h / 2 - 22} width={f.w + 44} height={f.h + 44} fill="#3E2E22" {...OUT} />
        <svg x={-f.w / 2} y={-f.h / 2} width={f.w} height={f.h} viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice" overflow="hidden">
          <rect width={200} height={260} fill="#BDB09A" />
          {f.picture}
        </svg>
        <rect x={-f.w / 2} y={-f.h / 2} width={f.w} height={f.h} fill="none" stroke={OUT.stroke} strokeWidth={4} />
        {f.ribbon && <path d={`M ${-f.w / 2 - 22} ${-f.h / 2 + 70} L ${-f.w / 2 + 70} ${-f.h / 2 - 22} L ${-f.w / 2 + 120} ${-f.h / 2 - 22} L ${-f.w / 2 - 22} ${-f.h / 2 + 120} Z`} fill="#0C0B0D" stroke="none" />}
        {f.label && <text x={0} y={f.h / 2 + 72} textAnchor="middle" fontFamily={ROBOTO} fontWeight={700} fontSize={Math.max(28, f.w * .14)} fill="#CFC6B4">{f.label}</text>}
      </g>
    ))}
  </g>
);
