// FrontDoor.tsx: a flat's steel front door, seen from the hallway inside, in world coordinates (the door's centre at
// x 540, the floor at y 1620). Draw it inside <World>.
//   ring 0..1   the doorbell's chime box on the wall buzzes, with sound lines (and the door shudders a little)
//   turn        the thumb-turn on the lock, radians (0 = open, −π/2 = locked)
//   lever       the handle's angle, radians (a little negative: someone outside pressing it)
//   feet 0..1   two shadows cutting the light under the door
//   open 0..1   the door swings open toward you: the landing's light and whoever stands there, in the gap (gap)
//   light 0..1  the stairwell's timer light under the door
import React from "react";
import { OUT } from "../style";
import { Glow } from "../ui/Frame";

export const LOCK: [number, number] = [770, 1110], CHIME: [number, number] = [978, 755], PEEP: [number, number] = [540, 720];

export const FrontDoor: React.FC<{ ring?: number; turn?: number; lever?: number; feet?: number; open?: number; light?: number; gap?: React.ReactNode }> = ({ ring = 0, turn = 0, lever = 0, feet = 0, open = 0, light = 1, gap }) => {
  const lw = 556 * (1 - .75 * open), jx = ring > .05 ? Math.sin(ring * 60) * 4 * ring : 0;
  return (
    <g {...OUT}>
      {/* the hallway: wall, a lighter patch where the light falls, the parquet */}
      <rect x={-900} y={-900} width={2900} height={3700} fill="#2E3446" stroke="none" />
      <ellipse cx={540} cy={900} rx={820} ry={900} fill="#38405A" stroke="none" />
      <rect x={-900} y={1620} width={2900} height={1300} fill="#3A2F2A" />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <path key={i} d={`M ${i * 170 - 60} 1624 L ${i * 260 - 330} 2600`} stroke="#271F1B" strokeWidth={3} />)}
      {/* the frame, and the landing behind it where the door opens */}
      <rect x={220} y={300} width={640} height={1320} fill="#3F3129" />
      <rect x={262} y={342} width={556} height={1264} fill="#F2DDA8" stroke="none" />
      <clipPath id="door-opening"><rect x={262} y={342} width={556} height={1264} /></clipPath>
      {open > 0 && <g clipPath="url(#door-opening)">{gap}</g>}
      {/* the light under the door and the feet that cut it */}
      <rect x={270} y={1606} width={540} height={14} fill="#F5D9A0" stroke="none" />
      <Glow id="door-gap" x={540} y={1640} r={320} color="#FFDDA0" a={.6 * light} />
      {[-1, 1].map((s) => <ellipse key={s} cx={540 + s * 70} cy={1613} rx={46} ry={8} fill="#100D16" stroke="none" opacity={feet} />)}
      {/* the leaf (swinging on its left hinge), two panels, the peephole, the lever, the lock */}
      <g transform={`translate(${jx} 0)`}>
        <path d={`M 262 342 L ${262 + lw} ${342 - 30 * open} L ${262 + lw} ${1606 + 30 * open} L 262 1606 Z`} fill="#6E5340" />
        {open < .2 && (
          <>
            <rect x={330} y={420} width={420} height={470} rx={14} fill="#634A39" strokeWidth={4} />
            <rect x={330} y={980} width={420} height={540} rx={14} fill="#634A39" strokeWidth={4} />
            <circle cx={PEEP[0]} cy={PEEP[1]} r={17} fill="#B8954A" />
            <circle cx={PEEP[0]} cy={PEEP[1]} r={7} fill="#0D0B12" stroke="none" />
            <g transform={`rotate(${(lever * 180) / Math.PI} 770 1000)`}>
              <path d="M 770 1000 L 650 1012" stroke={OUT.stroke} strokeWidth={34} />
              <path d="M 770 1000 L 650 1012" stroke="#C9A54E" strokeWidth={24} />
              <circle cx={770} cy={1000} r={26} fill="#B8954A" />
            </g>
            <circle cx={LOCK[0]} cy={LOCK[1]} r={30} fill="#B8954A" />
            <g transform={`rotate(${(turn * 180) / Math.PI} ${LOCK[0]} ${LOCK[1]})`}>
              <rect x={LOCK[0] - 40} y={LOCK[1] - 11} width={80} height={22} rx={9} fill="#D4B062" />
            </g>
          </>
        )}
      </g>
      {/* the chime box, buzzing when it rings */}
      <g transform={`translate(${jx * 1.5} 0)`}>
        <rect x={CHIME[0] - 48} y={CHIME[1] - 65} width={96} height={130} rx={16} fill="#D8CDB4" />
        <circle cx={CHIME[0]} cy={CHIME[1]} r={24} fill="#A99F88" />
      </g>
      {ring > .05 && [1, 2, 3].map((i) => {
        const r = 70 + i * 36, a = ring * (1 - i * .2);
        return [-1, 1].map((s) => <path key={`${i}${s}`} d={`M ${CHIME[0] + s * r * .55} ${CHIME[1] - r * .7} Q ${CHIME[0] + s * r * .95} ${CHIME[1]} ${CHIME[0] + s * r * .55} ${CHIME[1] + r * .7}`} fill="none" stroke="#F2E6C8" strokeWidth={9} opacity={a} />);
      })}
    </g>
  );
};
