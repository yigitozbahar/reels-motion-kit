// CarInterior.tsx: inside a car at night, from the passenger seat (first person), in world coordinates (1080×1920): the
// windshield with the night through it, the rear-view mirror at the top, the dashboard and its glow, the steering wheel
// on the left (the driver's side), the ignition by it.
//   outside      what the windshield shows: drawn in world coordinates and clipped to the glass
//   mirror       what the rear-view mirror shows: drawn in a MIRROR_W × MIRROR_H box (0,0 top-left), clipped to it
//   glow 0..1    the dashboard lights (the engine is on)
//   drops t      raindrops running down the glass (pass the time; omit for none)
// KEY: the ignition, MIRROR: the mirror's centre.
import React from "react";
import { hash } from "../../lib/anim";
import { OUT } from "../style";

export const KEY: [number, number] = [470, 1335], MIRROR: [number, number] = [540, 330], MIRROR_W = 420, MIRROR_H = 140;
const GLASS = "M 60 160 L 1020 160 L 1110 940 L -30 940 Z";

export const CarInterior: React.FC<{ outside?: React.ReactNode; mirror?: React.ReactNode; glow?: number; drops?: number; children?: React.ReactNode }> = ({ outside, mirror, glow = 0, drops, children }) => (
  <g>
    <defs>
      <clipPath id="car-glass"><path d={GLASS} /></clipPath>
      <clipPath id="car-mirror"><rect x={0} y={0} width={MIRROR_W} height={MIRROR_H} rx={26} /></clipPath>
    </defs>
    <rect x={-600} y={-600} width={2300} height={3200} fill="#0B0B0E" />
    <g clipPath="url(#car-glass)">
      <rect x={-600} y={-600} width={2300} height={1600} fill="#0C1119" />
      {outside}
      {drops !== undefined && Array.from({ length: 40 }, (_, i) => {
        const y = 160 + ((hash(i * 3.3) * 780 + drops * (40 + 90 * hash(i))) % 780);
        return <ellipse key={i} cx={hash(i * 1.9) * 1080} cy={y} rx={4 + 4 * hash(i * 5)} ry={7 + 5 * hash(i * 5)} fill="#8FA2BC" opacity={.35} />;
      })}
    </g>
    <g {...OUT}>
      {/* the roof, the pillars */}
      <path d="M -600 -600 H 1700 V 160 H 60 L -30 940 L -600 940 Z" fill="#121216" />
      <path d="M 1700 160 V 940 H 1110 L 1020 160 Z" fill="#121216" />
      {/* the mirror */}
      <path d={`M ${MIRROR[0]} 160 V ${MIRROR[1] - MIRROR_H / 2}`} strokeWidth={16} />
      <g transform={`translate(${MIRROR[0] - MIRROR_W / 2} ${MIRROR[1] - MIRROR_H / 2})`}>
        <rect x={-14} y={-14} width={MIRROR_W + 28} height={MIRROR_H + 28} rx={36} fill="#1C1C22" />
        <g clipPath="url(#car-mirror)"><rect width={MIRROR_W} height={MIRROR_H} fill="#0D1118" />{mirror}</g>
        <rect width={MIRROR_W} height={MIRROR_H} rx={26} fill="none" strokeWidth={5} />
      </g>
      {/* the dashboard, its lights */}
      <path d="M -600 900 Q 540 840 1700 900 V 2600 H -600 Z" fill="#17171C" />
      <path d="M -40 980 Q 300 950 560 960" fill="none" stroke="#2A2A31" strokeWidth={14} />
      <ellipse cx={230} cy={1040} rx={170} ry={60} fill="#3FA7A0" opacity={.06 + .3 * glow} stroke="none" />
      {[150, 300].map((x) => <circle key={x} cx={x} cy={1040} r={46} fill="#0E1418" stroke={glow > .3 ? "#58C2B8" : "#2A2E33"} strokeWidth={5} />)}
      <rect x={700} y={1020} width={260} height={70} rx={14} fill="#0E1418" strokeWidth={5} />
      {/* the wheel, the ignition */}
      <circle cx={230} cy={1300} r={270} fill="none" stroke={OUT.stroke} strokeWidth={58} />
      <circle cx={230} cy={1300} r={270} fill="none" stroke="#24242B" strokeWidth={44} />
      <circle cx={230} cy={1300} r={80} fill="#24242B" />
      <path d="M 150 1300 H -40 M 310 1300 H 500" stroke="#24242B" strokeWidth={40} />
      <circle cx={KEY[0]} cy={KEY[1]} r={34} fill="#2E2E36" />
      <circle cx={KEY[0]} cy={KEY[1]} r={14} fill="#0B0B0E" />
    </g>
    {children}
  </g>
);
