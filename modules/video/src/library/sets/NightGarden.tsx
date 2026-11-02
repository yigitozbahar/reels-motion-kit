// NightGarden.tsx: a house's back garden at night in the rain, in world coordinates, wider than the frame: the house on
// the left (one lit window upstairs, the basement window at the ground), wet grass, a car parked on the right.
//   lit 0..1      the upstairs window's light
//   cellar 0..1   the basement window swings open (BASEMENT_WIN: its centre)
//   car           draw the car (CAR: the middle of its side, CAR_DOOR: the front door's handle)
//   children      drawn on the grass, in front of the house and behind the car (people crossing the garden)
import React from "react";
import { hash } from "../../lib/anim";
import { OUT } from "../style";

export const GRASS_Y = 1520, BASEMENT_WIN: [number, number] = [260, 1470], CAR: [number, number] = [1180, 1440], CAR_DOOR: [number, number] = [1080, 1400];

export const NightGarden: React.FC<{ lit?: number; cellar?: number; car?: boolean; children?: React.ReactNode }> = ({ lit = 1, cellar = 0, car = true, children }) => (
  <g>
    <defs>
      <linearGradient id="ng-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070C" /><stop offset="1" stopColor="#111823" /></linearGradient>
    </defs>
    <rect x={-1200} y={-800} width={3600} height={3600} fill="url(#ng-sky)" />
    {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-900 + i * 420} cy={1250 - 120 * hash(i)} rx={260} ry={160 + 90 * hash(i * 3)} fill="#0A100D" />)}
    <g {...OUT}>
      {/* the house: its wall, the roof, the lit window, the basement window */}
      <rect x={-900} y={560} width={1420} height={GRASS_Y - 560} fill="#1B1A1E" />
      <path d="M -960 580 L -190 160 L 580 580 Z" fill="#141317" />
      <rect x={-560} y={760} width={220} height={300} fill={lit > .3 ? "#C9A066" : "#2A2620"} opacity={.35 + .65 * lit} />
      <path d="M -450 760 V 1060 M -560 910 H -340" strokeWidth={10} />
      <rect x={60} y={760} width={220} height={300} fill="#0D0E12" />
      <rect x={BASEMENT_WIN[0] - 110} y={BASEMENT_WIN[1] - 50} width={220} height={100} fill="#08080A" />
      <g transform={`translate(${BASEMENT_WIN[0] - 110} ${BASEMENT_WIN[1] - 50}) scale(1 ${1 - .85 * cellar})`}><rect width={220} height={100} fill="#2B3440" strokeWidth={5} /></g>
    </g>
    {/* the wet grass, its glints */}
    <rect x={-1200} y={GRASS_Y} width={3600} height={1300} fill="#0E1611" />
    {Array.from({ length: 60 }, (_, i) => <path key={i} d={`M ${-1100 + hash(i * 1.7) * 3300} ${GRASS_Y + 20 + hash(i * 4.1) * 500} l 10 -26`} stroke="#22322A" strokeWidth={4} />)}
    {children}
    {car && (
      <g {...OUT}>
        <path d={`M ${CAR[0] - 380} ${CAR[1] + 60} L ${CAR[0] - 370} ${CAR[1] - 40} Q ${CAR[0] - 300} ${CAR[1] - 70} ${CAR[0] - 230} ${CAR[1] - 80} L ${CAR[0] - 140} ${CAR[1] - 190} Q ${CAR[0]} ${CAR[1] - 220} ${CAR[0] + 160} ${CAR[1] - 190} L ${CAR[0] + 270} ${CAR[1] - 80} Q ${CAR[0] + 380} ${CAR[1] - 70} ${CAR[0] + 400} ${CAR[1] - 10} L ${CAR[0] + 400} ${CAR[1] + 60} Z`} fill="#2A2E36" />
        <path d={`M ${CAR[0] - 200} ${CAR[1] - 86} L ${CAR[0] - 125} ${CAR[1] - 172} Q ${CAR[0] - 20} ${CAR[1] - 192} ${CAR[0] + 10} ${CAR[1] - 190} L ${CAR[0] + 10} ${CAR[1] - 86} Z M ${CAR[0] + 40} ${CAR[1] - 86} L ${CAR[0] + 40} ${CAR[1] - 188} Q ${CAR[0] + 130} ${CAR[1] - 180} ${CAR[0] + 160} ${CAR[1] - 170} L ${CAR[0] + 235} ${CAR[1] - 86} Z`} fill="#3A4656" />
        <path d={`M ${CAR[0] - 120} ${CAR[1] - 80} V ${CAR[1] + 50} M ${CAR[0] + 25} ${CAR[1] - 80} V ${CAR[1] + 50}`} strokeWidth={4} />
        <rect x={CAR_DOOR[0] - 22} y={CAR_DOOR[1] - 6} width={44} height={12} rx={6} fill="#555B66" strokeWidth={3} />
        {[-240, 250].map((dx) => <g key={dx}><circle cx={CAR[0] + dx} cy={CAR[1] + 62} r={66} fill="#111114" /><circle cx={CAR[0] + dx} cy={CAR[1] + 62} r={26} fill="#4A4E56" /></g>)}
        <ellipse cx={CAR[0] + 396} cy={CAR[1] - 20} rx={14} ry={22} fill="#C9B98E" strokeWidth={3} />
      </g>
    )}
  </g>
);
