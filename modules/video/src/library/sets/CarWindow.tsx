// CarWindow.tsx: a car's side window seen from inside, at night in the rain, in world coordinates (1080×1920): the door
// frame round it, the glass, whoever stands outside it (children, drawn in world coordinates and clipped to the glass).
//   drops t      raindrops running down the glass (pass the time; omit for none)
//   print 0..1   a wet handprint pressed on the glass, at printAt (PRINT by default)
//   fog 0..1     breath fogging the glass
import React from "react";
import { hash } from "../../lib/anim";
import { OUT } from "../style";

export const PRINT: [number, number] = [640, 760];
const GLASS = "M 120 320 L 980 260 Q 1040 260 1040 330 L 1040 1240 L 120 1240 Z";

export const CarWindow: React.FC<{ drops?: number; print?: number; printAt?: [number, number]; fog?: number; children?: React.ReactNode }> = ({ drops, print = 0, printAt = PRINT, fog = 0, children }) => (
  <g>
    <defs><clipPath id="carwin-glass"><path d={GLASS} /></clipPath></defs>
    <rect x={-600} y={-600} width={2300} height={3200} fill="#0B0B0E" />
    <g clipPath="url(#carwin-glass)">
      <rect x={-600} y={-600} width={2300} height={2400} fill="#0D131C" />
      {children}
      {fog > 0 && <rect x={0} y={0} width={1200} height={1400} fill="#9AA6B4" opacity={.18 * fog} />}
      {drops !== undefined && Array.from({ length: 46 }, (_, i) => {
        const y = 260 + ((hash(i * 3.7) * 980 + drops * (30 + 80 * hash(i))) % 980);
        return <ellipse key={i} cx={120 + hash(i * 2.9) * 920} cy={y} rx={5 + 4 * hash(i * 5)} ry={9 + 6 * hash(i * 5)} fill="#9FB1C8" opacity={.4} />;
      })}
      {print > 0 && (
        <g transform={`translate(${printAt[0]} ${printAt[1]})`} opacity={.55 * print} fill="#C9D3DE">
          <ellipse cx={0} cy={40} rx={80} ry={95} />
          {[-62, -22, 18, 56].map((dx, i) => <ellipse key={i} cx={dx} cy={-70 - (i === 1 || i === 2 ? 22 : 0)} rx={20} ry={58} />)}
          <ellipse cx={-110} cy={40} rx={20} ry={50} transform="rotate(-30 -110 40)" />
        </g>
      )}
    </g>
    <g {...OUT}>
      <path d={`M -600 -600 H 1700 V 2600 H -600 Z ${GLASS}`} fill="#18181D" fillRule="evenodd" />
      <path d="M 120 1240 H 1040" strokeWidth={14} />
      <rect x={160} y={1330} width={320} height={60} rx={20} fill="#22222A" />
    </g>
  </g>
);
