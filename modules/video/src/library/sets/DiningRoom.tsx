// DiningRoom.tsx: a family dining room at night, in world coordinates, wider than the frame: the table in the middle (its
// long side towards us, five places), a pendant lamp over it, a framed family photo on the wall; to the right the window
// (curtains, the dark outside) and next to it the basement door.
//   lamp 0..1     the pendant light (dim it, flicker it)
//   photo         how many people the framed photo shows (0: no photo)
//   knock 0..1    the basement door shudders
//   seated        drawn behind the tabletop: people sitting (their waists at TABLE_Y, at SEATS)
//   children      drawn in front of everything
// WINDOW, BASEMENT: the centres of the window and the basement door; LOCK: the basement door's thumb-turn.
import React from "react";
import { hash } from "../../lib/anim";
import { OUT } from "../style";
import { Glow } from "../ui/Frame";

export const TABLE_Y = 1230, SEATS = [170, 355, 540, 725, 910];
export const WINDOW: [number, number] = [1330, 820], BASEMENT: [number, number] = [1700, 1100], LOCK: [number, number] = [1612, 1120];
const FLOOR = 1560;

export const DiningRoom: React.FC<{ lamp?: number; photo?: number; knock?: number; seated?: React.ReactNode; children?: React.ReactNode }> = ({ lamp = 1, photo = 4, knock = 0, seated, children }) => {
  const kx = knock * 6 * Math.sin(knock * 40);
  return (
    <g {...OUT}>
      {/* the wall, its paper, the floor */}
      <rect x={-800} y={-600} width={3400} height={FLOOR + 600} fill="#3E2F2A" stroke="none" />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${-760 + i * 110} -600 V ${FLOOR}`} stroke="#463631" strokeWidth={18} />)}
      <rect x={-800} y={FLOOR} width={3400} height={1200} fill="#2C201C" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M -800 ${FLOOR + 60 + i * 70} H 2600`} stroke="#241A17" strokeWidth={4} />)}
      <ellipse cx={540} cy={900} rx={900} ry={700} fill="#FFD9A0" opacity={.16 * lamp} stroke="none" />
      {/* the family photo on the wall */}
      {photo > 0 && (
        <g>
          <rect x={250} y={520} width={220} height={170} rx={6} fill="#5A4130" />
          <rect x={266} y={536} width={188} height={138} fill="#C9B79C" />
          {Array.from({ length: photo }, (_, i) => {
            const cx = 266 + 188 * (i + .5) / photo, tall = [1, .82, .9, .7][i % 4];
            return <g key={i} stroke="none"><circle cx={cx} cy={674 - 96 * tall} r={13} fill="#6E5A48" /><path d={`M ${cx - 20} 674 Q ${cx} ${674 - 80 * tall} ${cx + 20} 674 Z`} fill="#6E5A48" /></g>;
          })}
        </g>
      )}
      {/* the window: night outside, the curtains */}
      <rect x={WINDOW[0] - 150} y={WINDOW[1] - 260} width={300} height={520} fill="#121828" />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={WINDOW[0] - 130 + hash(i * 2.3) * 260} cy={WINDOW[1] - 240 + hash(i * 4.1) * 480} r={3} fill="#3A4566" stroke="none" />)}
      <rect x={WINDOW[0] - 150} y={WINDOW[1] - 260} width={300} height={520} fill="none" stroke="#5A4A3E" strokeWidth={20} />
      <path d={`M ${WINDOW[0]} ${WINDOW[1] - 260} V ${WINDOW[1] + 260} M ${WINDOW[0] - 150} ${WINDOW[1]} H ${WINDOW[0] + 150}`} stroke="#5A4A3E" strokeWidth={12} />
      {[-1, 1].map((s) => <path key={s} d={`M ${WINDOW[0] + s * 150} ${WINDOW[1] - 300} L ${WINDOW[0] + s * 230} ${WINDOW[1] - 300} L ${WINDOW[0] + s * 240} ${WINDOW[1] + 320} L ${WINDOW[0] + s * 140} ${WINDOW[1] + 320} Z`} fill="#5E3F3A" />)}
      {/* the basement door: its frame, the step down behind it, the gap of dark under it */}
      <g transform={`translate(${kx} 0)`}>
        <rect x={BASEMENT[0] - 140} y={BASEMENT[1] - 480} width={280} height={FLOOR - BASEMENT[1] + 480} fill="#4A3A30" />
        <rect x={BASEMENT[0] - 115} y={BASEMENT[1] - 455} width={230} height={FLOOR - BASEMENT[1] + 445} fill="#5C4636" />
        {[-300, -60].map((dy) => <rect key={dy} x={BASEMENT[0] - 85} y={BASEMENT[1] + dy} width={170} height={190} rx={8} fill="#523F31" strokeWidth={4} />)}
        <circle cx={LOCK[0] - 6} cy={LOCK[1] - 70} r={16} fill="#B9A06A" />
        <rect x={LOCK[0] - 14} y={LOCK[1] - 34} width={28} height={68} rx={10} fill="#B9A06A" />
      </g>
      <rect x={BASEMENT[0] - 115} y={FLOOR - 12} width={230} height={14} fill="#0A0707" />
      {/* the lamp, the people at the table, the table */}
      <path d="M 540 -600 V 330" stroke="#1A1420" strokeWidth={6} />
      <path d="M 450 420 L 490 330 L 590 330 L 630 420 Z" fill={lamp > .5 ? "#C98A3E" : "#6B4A2A"} />
      <ellipse cx={540} cy={425} rx={50} ry={14} fill={lamp > .5 ? "#FFF2C8" : "#5A5048"} />
      <Glow id="dining-lamp" x={540} y={460} r={700} color="#FFDDA0" a={.55 * lamp} />
      {seated}
      <rect x={40} y={TABLE_Y - 30} width={1000} height={50} rx={8} fill="#6A4630" />
      <path d={`M 30 ${TABLE_Y} H 1050 L 1060 ${TABLE_Y + 250} Q 540 ${TABLE_Y + 275} 20 ${TABLE_Y + 250} Z`} fill="#E6DCC8" />
      <path d={`M 26 ${TABLE_Y + 232} Q 540 ${TABLE_Y + 258} 1056 ${TABLE_Y + 232}`} fill="none" stroke="#C9BBA0" strokeWidth={6} />
      {[90, 990].map((x) => <rect key={x} x={x - 18} y={TABLE_Y + 255} width={36} height={FLOOR - TABLE_Y - 255} fill="#4E3424" />)}
      {SEATS.map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={TABLE_Y - 18} rx={70} ry={16} fill="#F4EFE6" />
          <ellipse cx={x} cy={TABLE_Y - 20} rx={38} ry={8} fill="#B5643C" strokeWidth={3} />
          <rect x={x + 62} y={TABLE_Y - 70} width={26} height={52} rx={5} fill="#C9DCE4" opacity={.9} strokeWidth={4} />
        </g>
      ))}
      <path d={`M 470 ${TABLE_Y - 25} Q 470 ${TABLE_Y - 95} 540 ${TABLE_Y - 98} Q 610 ${TABLE_Y - 95} 610 ${TABLE_Y - 25} Z`} fill="#8E4B32" />
      <ellipse cx={540} cy={TABLE_Y - 98} rx={70} ry={14} fill="#A85A3A" />
      <rect x={-800} y={-600} width={3400} height={3400} fill="#0B0A0F" opacity={.55 * (1 - lamp)} stroke="none" />
      {children}
    </g>
  );
};
