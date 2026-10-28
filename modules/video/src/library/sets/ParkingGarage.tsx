// ParkingGarage.tsx: an underground car park seen down its aisle, in one-point perspective, in world coordinates:
// concrete pillars with their numbers, cars nosed in between them on both sides, a strip light over every row. It can
// go on for ever: rows are drawn from where you stand into the dark.
//   travel   how far down the aisle you are (world units; a row every GARAGE_ROW)
//   lamp     (row) => 0..1: each row's light (on, dimmed, off); rows count from 0 at the entrance
//   reach    how many rows are drawn ahead (they fade into the dark)
// garageAt(X, Y, d) → [x, y, scale]: where a point X across, Y below eye height and d ahead lands, to put things in the
// aisle (a light in the distance, a bike). The floor is at Y = GARAGE_FLOOR.
import React from "react";
import { clamp, hash } from "../../lib/anim";
import { INK } from "../style";

export const GARAGE_ROW = 520, GARAGE_VP: [number, number] = [540, 860], GARAGE_FLOOR = 620;
const F = 900, PX = 560, CEIL = -430, FLOOR = GARAGE_FLOOR;
export const garageAt = (X: number, Y: number, d: number): [number, number, number] => {
  const s = F / Math.max(d, 1);
  return [GARAGE_VP[0] + X * s, GARAGE_VP[1] + Y * s, s];
};

const CARS = ["#5C6470", "#6E2F35", "#3E4F66", "#8A8A84", "#2F3A35", "#7A6A58", "#4A4552"];
const quad = (pts: [number, number, number][]) => pts.map(([X, Y, d]) => garageAt(X, Y, d).slice(0, 2).join(" ")).join(" L ");

const Car: React.FC<{ X: number; d: number; color: string }> = ({ X, d, color }) => {
  const [x, y, s] = garageAt(X, FLOOR, d), sw = clamp(6 * s, 1, 6), w = 440 * s;
  return (
    <g stroke={INK} strokeWidth={sw} strokeLinejoin="round">
      <path d={`M ${x - w * .4} ${y - 250 * s} L ${x - w * .3} ${y - 400 * s} L ${x + w * .3} ${y - 400 * s} L ${x + w * .4} ${y - 250 * s} Z`} fill="#1E2430" />
      <rect x={x - w / 2} y={y - 260 * s} width={w} height={210 * s} rx={40 * s} fill={color} />
      {[-1, 1].map((k) => <ellipse key={k} cx={x + k * w * .34} cy={y - 190 * s} rx={42 * s} ry={22 * s} fill="#C9C6B8" />)}
      <rect x={x - w * .18} y={y - 150 * s} width={w * .36} height={40 * s} rx={8 * s} fill="#2A2830" />
      {[-1, 1].map((k) => <rect key={k} x={x + k * w * .36 - 34 * s} y={y - 60 * s} width={68 * s} height={60 * s} rx={10 * s} fill="#141318" />)}
    </g>
  );
};

const Row: React.FC<{ k: number; d0: number; d1: number; a: number; L: number; pillar: boolean }> = ({ k, d0, d1, a, L, pillar }) => {
  const dm = (d0 + d1) / 2, [, , sm] = garageAt(0, 0, dm), sw = clamp(6 * sm, 1, 6);
  const [lx, ly] = garageAt(0, CEIL + 18, dm), [fx, fy, fs] = garageAt(0, FLOOR, dm);
  return (
    <g opacity={a}>
      <path d={`M ${quad([[-4000, FLOOR, d0], [4000, FLOOR, d0], [4000, FLOOR, d1], [-4000, FLOOR, d1]])} Z`} fill="#3A3B40" />
      <path d={`M ${quad([[-4000, CEIL, d0], [4000, CEIL, d0], [4000, CEIL, d1], [-4000, CEIL, d1]])} Z`} fill="#2B2C31" />
      <path d={`M ${quad([[-14, FLOOR, d0 + 40], [14, FLOOR, d0 + 40], [14, FLOOR, d0 + 260], [-14, FLOOR, d0 + 260]])} Z`} fill="#9A9584" />
      {[-1, 1].map((side) => <path key={side} d={`M ${quad([[side * (PX - 70), FLOOR, d0], [side * (PX - 50), FLOOR, d0], [side * (PX - 50), FLOOR, d1], [side * (PX - 70), FLOOR, d1]])} Z`} fill="#6E6A5E" />)}
      {L > .01 && <ellipse cx={fx} cy={fy} rx={760 * fs} ry={260 * fs} fill="url(#garage-pool)" opacity={L} />}
      {[-1, 1].map((side) => hash(k * 7.3 + side) < .1 ? null : <Car key={side} X={side * (PX + 330)} d={dm} color={CARS[Math.floor(hash(k * 3.7 + side * 1.9) * CARS.length)]} />)}
      {pillar && [-1, 1].map((side) => {
        const [x0, y0, s] = garageAt(side * PX - 55, CEIL, d0), [x1, y1] = garageAt(side * PX + 55, FLOOR, d0), [, py] = garageAt(0, -60, d0);
        return (
          <g key={side} stroke={INK} strokeWidth={clamp(6 * s, 1, 6)} strokeLinejoin="round">
            <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#77736B" />
            <rect x={x0} y={y1 - 120 * s} width={x1 - x0} height={50 * s} fill="#9A4038" stroke="none" />
            <rect x={x0 + 14 * s} y={py} width={x1 - x0 - 28 * s} height={110 * s} rx={8 * s} fill="#1F1E24" />
            <text x={(x0 + x1) / 2} y={py + 82 * s} fontSize={72 * s} fontFamily="sans-serif" fontWeight={700} textAnchor="middle" fill="#E9E2CF" stroke="none">{k + 1}</text>
          </g>
        );
      })}
      <rect x={lx - 150 * sm} y={ly - 12 * sm} width={300 * sm} height={26 * sm} rx={8 * sm} fill={L > .5 ? "#F7F3DE" : "#4A4A50"} stroke={INK} strokeWidth={sw} />
      {L > .01 && <ellipse cx={lx} cy={ly} rx={420 * sm} ry={120 * sm} fill="url(#garage-pool)" opacity={.8 * L} />}
    </g>
  );
};

export const ParkingGarage: React.FC<{ travel?: number; lamp?: (row: number) => number; reach?: number }> = ({ travel = 0, lamp = () => 1, reach = 16 }) => {
  const first = Math.max(0, Math.floor(travel / GARAGE_ROW)), rows: React.ReactNode[] = [];
  for (let k = first + reach; k >= first; k--) {
    const d0 = k * GARAGE_ROW - travel, d1 = d0 + GARAGE_ROW;
    if (d1 < 40) continue;
    const fog = clamp(1.15 - d0 / (reach * GARAGE_ROW)), L = clamp(lamp(k));
    rows.push(<Row key={k} k={k} d0={Math.max(d0, 40)} d1={d1} a={fog * (.14 + .86 * L)} L={L} pillar={d0 >= 40} />);
  }
  return (
    <g>
      <defs><radialGradient id="garage-pool"><stop offset="0" stopColor="#F2EDCF" stopOpacity={.5} /><stop offset="1" stopColor="#F2EDCF" stopOpacity={0} /></radialGradient></defs>
      <rect x={-2000} y={-2000} width={5080} height={5920} fill="#060608" />
      {rows}
    </g>
  );
};
