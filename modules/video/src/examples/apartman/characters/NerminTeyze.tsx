// NerminTeyze.tsx: the neighbour from upstairs (the example story's character), drawn once and reusable in any story. Flat
// 2D, thick outline.
// An SVG <g>: (x, y) is between her feet, h her height in px. She's 1000 units tall inside.
//   outfit     'robe' (night: a quilted robe and fluffy slippers) | 'coat' (day: a cardigan, flat shoes)
//   face       'smile' (kind, closed) | 'grin' (wide, teeth, the corners pulled up)
//   eyeK 0..1  the eyes widen and the pupils shrink: she stares
//   look       [x, y] −1..1: where her pupils point
//   keyUp 0..1 her right hand comes up holding a key on a red tag (showKey: false hides it)
//   tilt       the head's tilt, radians
import React from "react";
import { lerp } from "../../../lib/anim";
import { OUT } from "../../../library/style";

const SKIN = "#EDE6DA", SCARF = "#D6A23E", SCARF_DK = "#B98A2E";

export type NerminProps = {
  x: number; y: number; h: number;
  outfit?: "robe" | "coat"; face?: "smile" | "grin"; eyeK?: number; look?: [number, number];
  keyUp?: number; showKey?: boolean; tilt?: number;
};

export const NerminTeyze: React.FC<NerminProps> = ({ x, y, h, outfit = "robe", face = "smile", eyeK = 0, look = [0, 0], keyUp = 0, showKey = true, tilt = 0 }) => {
  const body = outfit === "robe" ? "#7B5C88" : "#5C6E8A", bodyDk = outfit === "robe" ? "#5E4469" : "#46556C", lapel = outfit === "robe" ? "#A07FAA" : "#7D8EA8";
  const k = keyUp, hand: [number, number] = [lerp(255, 215, k), lerp(-345, -560, k)], elbow: [number, number] = [lerp(250, 320, k), lerp(-500, -450, k)];
  const ew = 37 * (1 + .22 * eyeK), pr = 13 * (1 - .35 * eyeK), mo = face === "grin" ? 22 + 40 * eyeK : 0;
  const arm = (d: string) => (<><path d={d} fill="none" stroke={OUT.stroke} strokeWidth={104} strokeLinecap="round" /><path d={d} fill="none" stroke={body} strokeWidth={90} strokeLinecap="round" /></>);
  return (
    <g transform={`translate(${x} ${y}) scale(${h / 1000})`} {...OUT}>
      {/* feet */}
      {outfit === "robe" ? [-1, 1].map((s) => (
        <g key={s}>
          <rect x={s * 85 - 20} y={-160} width={40} height={130} fill={SKIN} />
          <ellipse cx={s * 85} cy={-24} rx={82} ry={32} fill="#D27C97" />
          <circle cx={s * 85 + s * 34} cy={-44} r={20} fill="#EBA7BC" />
        </g>
      )) : [-1, 1].map((s) => (
        <g key={s}><rect x={s * 85 - 22} y={-160} width={44} height={130} fill="#4A3B36" /><ellipse cx={s * 85} cy={-20} rx={70} ry={24} fill="#2E2630" /></g>
      ))}
      {/* the body: a long robe (or a cardigan over a skirt), a belt, the lapels */}
      <path d="M -200 -670 L 200 -670 L 262 -140 Q 0 -112 -262 -140 Z" fill={body} />
      {outfit === "robe" && [-150, -60, 30, 120].map((dx) => <path key={dx} d={`M ${dx} -600 l 90 120 M ${dx - 40} -380 l 110 140`} stroke={bodyDk} strokeWidth={4} opacity={.6} />)}
      <path d="M 25 -655 Q -25 -420 35 -140" fill="none" />
      <rect x={-226} y={-458} width={452} height={42} rx={10} fill={bodyDk} />
      <path d="M -116 -676 L 0 -528 L 116 -676 Z" fill={lapel} />
      {/* the arms: the left hangs, the right comes up with the key (a silver house key: gold would vanish against the scarf) */}
      {arm("M -190 -630 Q -250 -500 -258 -380")}
      <circle cx={-258} cy={-352} r={40} fill={SKIN} />
      {arm(`M 190 -630 Q ${elbow[0]} ${elbow[1]} ${hand[0]} ${hand[1] + 25}`)}
      {showKey && (
        <g transform={`translate(${hand[0] - 10} ${hand[1] - 110}) scale(1.7)`}>
          <rect x={-8} y={-105} width={16} height={80} fill="#C9CED6" />
          <path d="M 8 -95 h 18 v 12 h -8 v 10 h 10 v 12 h -20" fill="#C9CED6" />
          <circle cx={0} cy={0} r={30} fill="#C9CED6" />
          <circle cx={0} cy={0} r={10} fill="#3C3340" />
          <rect x={-58} y={22} width={44} height={60} rx={8} fill="#B8433C" />
        </g>
      )}
      <circle cx={hand[0]} cy={hand[1]} r={40} fill={SKIN} />
      {/* the head: the scarf behind, the face, the fold of the scarf over the forehead */}
      <g transform={`rotate(${(tilt * 180) / Math.PI} 0 -670)`}>
        <path d="M -175 -820 L -125 -652 L 125 -652 L 175 -820 Z" fill={SCARF} />
        <ellipse cx={0} cy={-840} rx={182} ry={196} fill={SCARF} />
        {[[-145, -890], [-155, -760], [145, -870], [150, -740], [-70, -1000], [60, -1005]].map(([dx, dy]) => <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={9} fill="#F6E7C8" stroke="none" />)}
        <ellipse cx={0} cy={-800} rx={128} ry={134} fill={SKIN} />
        <path d="M -132 -828 Q -70 -905 0 -925 Q 70 -905 132 -828" fill="none" stroke={OUT.stroke} strokeWidth={52} />
        <path d="M -132 -828 Q -70 -905 0 -925 Q 70 -905 132 -828" fill="none" stroke={SCARF_DK} strokeWidth={40} />
        {[-1, 1].map((s) => (
          <g key={s}>
            <ellipse cx={s * 56} cy={-800} rx={38} ry={14} fill="#8B7A9A" opacity={.45} stroke="none" />
            <ellipse cx={s * 56} cy={-836} rx={ew} ry={ew * 1.05} fill="#FFFDF7" />
            <circle cx={s * 56 + look[0] * 15} cy={-836 + look[1] * 14} r={pr} fill={OUT.stroke} stroke="none" />
          </g>
        ))}
        <path d="M -4 -805 Q 14 -782 -2 -774" fill="none" strokeWidth={5} />
        {face === "grin" ? (
          <>
            <path d={`M -98 -766 Q 0 -728 98 -766 Q 60 ${-748 + mo} 0 ${-738 + mo * 1.6} Q -60 ${-748 + mo} -98 -766 Z`} fill="#3A2630" />
            <path d="M -76 -756 Q 0 -728 76 -756 L 70 -746 Q 0 -722 -70 -746 Z" fill="#FFFDF7" strokeWidth={3} />
          </>
        ) : (
          <path d="M -60 -762 Q 0 -728 60 -762" fill="none" strokeWidth={7} />
        )}
      </g>
    </g>
  );
};
