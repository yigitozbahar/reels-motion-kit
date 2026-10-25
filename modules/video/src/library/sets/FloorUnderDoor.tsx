// FloorUnderDoor.tsx: looking down at the floor inside the front door, in world coordinates: the door's bottom edge
// across the top, the light coming under it, the parquet. Something can slide in through the gap.
//   feet 0..1     two shadows standing in the light outside
//   slide 0..1    a sheet of paper comes in under the door, from the gap (0) to the middle of the floor (1)
import React from "react";
import { lerp } from "../../lib/anim";
import { OUT } from "../style";
import { Glow } from "../ui/Frame";

export const FloorUnderDoor: React.FC<{ feet?: number; slide?: number }> = ({ feet = 1, slide = 0 }) => {
  const py = lerp(380, 1000, slide), rot = lerp(0, -6, slide);
  return (
    <g {...OUT}>
      <rect x={-600} y={-600} width={2300} height={3200} fill="#3A2F2A" stroke="none" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <path key={i} d={`M -300 ${560 + i * 170} L 1380 ${580 + i * 170}`} stroke="#271F1B" strokeWidth={3} />)}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={`v${i}`} d={`M ${-100 + i * 220 + (i % 2) * 90} ${470 + (i % 3) * 170} v 170`} stroke="#271F1B" strokeWidth={3} />)}
      <rect x={-300} y={420} width={1680} height={20} fill="#F5D9A0" stroke="none" />
      <Glow id="floor-gap" x={540} y={445} r={480} color="#FFDDA0" a={.6} />
      {[-1, 1].map((s) => <ellipse key={s} cx={540 + s * 95} cy={430} rx={62} ry={9} fill="#100D16" stroke="none" opacity={feet} />)}
      <rect x={-300} y={-300} width={1680} height={722} fill="#6E5340" />
      {slide > 0 && (
        <g transform={`translate(540 ${py}) rotate(${rot})`}>
          <rect x={-210} y={-150} width={420} height={290} fill="#EFE6CF" stroke="#9C8E70" strokeWidth={4} />
          <rect x={-170} y={-110} width={200} height={14} fill="#CFC3A5" stroke="none" />
          <rect x={-170} y={-75} width={300} height={10} fill="#DDD2B6" stroke="none" />
        </g>
      )}
    </g>
  );
};
