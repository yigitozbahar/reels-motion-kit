// Forest.tsx: a wood at night under the moon, in world coordinates, wider than the frame: a clearing in the middle (the
// ground at GROUND_Y), an old stone well in it (WELL), trees in three depths. For 2.5D moves draw it in layers:
// layer 'back' (the sky, the moon, far trees), 'mid' (the clearing, the well, mid trees; children stand there), 'front'
// (near trunks, dark, at the edges), or 'all'.
//   moon 0..1   the moonlight on the clearing
//   fog 0..1    mist lying low over the ground
import React from "react";
import { hash } from "../../lib/anim";
import { OUT } from "../style";

export const GROUND_Y = 1500, WELL: [number, number] = [540, 1470];

const trunk = (x: number, w: number, top: number, bottom: number, fill: string, key: React.Key) => (
  <g key={key}>
    <path d={`M ${x - w / 2} ${bottom} L ${x - w * .35} ${top} L ${x + w * .35} ${top} L ${x + w / 2} ${bottom} Z`} fill={fill} />
    {[0, 1, 2].map((i) => { const y = top + (bottom - top) * (.2 + .25 * i), s = i % 2 ? 1 : -1; return <path key={i} d={`M ${x} ${y} L ${x + s * w * 1.6} ${y - w * 1.1}`} stroke={fill} strokeWidth={w * .22} />; })}
  </g>
);

export const Forest: React.FC<{ layer?: "back" | "mid" | "front" | "all"; moon?: number; fog?: number; well?: boolean; children?: React.ReactNode }> = ({ layer = "all", moon = 1, fog = .5, well = true, children }) => {
  const show = (l: string) => layer === "all" || layer === l;
  return (
    <g>
      {show("back") && (
        <g>
          <defs>
            <linearGradient id="forest-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#04060A" /><stop offset="1" stopColor="#0E1520" /></linearGradient>
            <radialGradient id="forest-moon"><stop offset="0" stopColor="#C9D4E2" stopOpacity={.5 * moon} /><stop offset="1" stopColor="#C9D4E2" stopOpacity={0} /></radialGradient>
          </defs>
          <rect x={-1500} y={-900} width={4100} height={3800} fill="url(#forest-sky)" />
          <circle cx={760} cy={260} r={340} fill="url(#forest-moon)" />
          <circle cx={760} cy={260} r={70} fill="#D8DEE6" opacity={.35 + .65 * moon} />
          {Array.from({ length: 22 }, (_, i) => trunk(-1300 + i * 180 + 60 * hash(i), 40 + 30 * hash(i * 3), 300 + 260 * hash(i * 5), GROUND_Y, "#0A0E12", `b${i}`))}
        </g>
      )}
      {show("mid") && (
        <g>
          <ellipse cx={540} cy={GROUND_Y + 160} rx={1700} ry={360} fill="#131A17" />
          <ellipse cx={540} cy={GROUND_Y + 60} rx={620} ry={150} fill="#9FB2C6" opacity={.12 * moon} />
          {Array.from({ length: 12 }, (_, i) => { const x = -1100 + i * 280 + 80 * hash(i * 7); return Math.abs(x - 540) < 520 ? null : trunk(x, 70 + 40 * hash(i * 11), 120 + 200 * hash(i * 13), GROUND_Y + 40, "#151B1E", `m${i}`); })}
          {well && (
            <g {...OUT}>
              <rect x={WELL[0] - 200} y={WELL[1] - 520} width={26} height={460} fill="#3A2B20" />
              <rect x={WELL[0] + 174} y={WELL[1] - 520} width={26} height={460} fill="#3A2B20" />
              <path d={`M ${WELL[0] - 250} ${WELL[1] - 500} L ${WELL[0]} ${WELL[1] - 640} L ${WELL[0] + 250} ${WELL[1] - 500} Z`} fill="#2C2119" />
              <path d={`M ${WELL[0]} ${WELL[1] - 500} V ${WELL[1] - 210}`} strokeWidth={4} />
              <path d={`M ${WELL[0] - 210} ${WELL[1] - 150} L ${WELL[0] - 210} ${WELL[1] + 40} Q ${WELL[0]} ${WELL[1] + 110} ${WELL[0] + 210} ${WELL[1] + 40} L ${WELL[0] + 210} ${WELL[1] - 150} Z`} fill="#4A4A46" />
              {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${WELL[0] - 210 + (i % 5) * 84 + (i > 4 ? 42 : 0)} ${WELL[1] - 150 + (i > 4 ? 95 : 0)} v 95`} strokeWidth={4} />)}
              <path d={`M ${WELL[0] - 210} ${WELL[1] - 55} Q ${WELL[0]} ${WELL[1] + 10} ${WELL[0] + 210} ${WELL[1] - 55}`} fill="none" strokeWidth={4} />
              <ellipse cx={WELL[0]} cy={WELL[1] - 150} rx={210} ry={50} fill="#5A5A54" />
              <ellipse cx={WELL[0]} cy={WELL[1] - 150} rx={165} ry={34} fill="#050506" />
            </g>
          )}
          {children}
          {fog > 0 && Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={-300 + i * 340} cy={GROUND_Y + 60 + 30 * hash(i)} rx={420} ry={60} fill="#AFC0D0" opacity={.06 * fog} />)}
        </g>
      )}
      {show("front") && (
        <g>{[-220, 1300].map((x, i) => trunk(x, 260, -900, GROUND_Y + 600, "#06080A", `f${i}`))}</g>
      )}
    </g>
  );
};
