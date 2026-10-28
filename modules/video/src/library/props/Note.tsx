// Note.tsx: a handwritten note on a torn sheet, big enough to fill the frame. A world-coordinate <g>: (x, y) its centre,
// w its width (the height follows the lines), angle its tilt (radians).
//   lines    the text, one string per line (handwriting: Caveat)
//   open 0..1  the folded sheet opens (it unfolds from a strip to full height); the text shows once it's open
//   mark     [line, 0..1]: that line gets a red underline drawn across it
import React from "react";
import { ease, seg } from "../../lib/anim";
import { CAVEAT, INK, OUT, RED } from "../style";

export const Note: React.FC<{ x: number; y: number; w?: number; angle?: number; lines: string[]; size?: number; open?: number; mark?: [number, number] }> = ({ x, y, w = 900, angle = 0, lines, size = 120, open = 1, mark }) => {
  const lh = size * 1.15, h = lines.length * lh + size * 1.1, k = .08 + .92 * ease(open), torn = Array.from({ length: 13 }, (_, i) => `L ${-w / 2 + (w * i) / 12} ${-h / 2 + (i % 2 ? 10 : -6)}`).join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI}) scale(1 ${k})`}>
      <path d={`M ${-w / 2} ${-h / 2} ${torn} L ${w / 2} ${h / 2} L ${-w / 2} ${h / 2} Z`} fill="#F3EEE1" {...OUT} />
      <path d={`M ${-w / 2} 0 H ${w / 2}`} stroke="#D9D0BC" strokeWidth={4} />
      {Array.from({ length: lines.length + 1 }, (_, i) => <path key={i} d={`M ${-w / 2 + 30} ${-h / 2 + size * .75 + i * lh} H ${w / 2 - 30}`} stroke="#C8D4E2" strokeWidth={3} />)}
      {open > .85 && lines.map((l, i) => (
        <text key={i} x={0} y={-h / 2 + size * .55 + (i + 1) * lh - lh * .25} textAnchor="middle" fontFamily={CAVEAT} fontSize={size} fill={INK} opacity={seg(open, .85, 1)}>{l}</text>
      ))}
      {mark && mark[1] > 0 && (
        <path d={`M ${-w / 2 + 70} ${-h / 2 + size * .55 + (mark[0] + 1) * lh - lh * .1} l ${(w - 140) * mark[1]} ${6 * mark[1]}`} stroke={RED} strokeWidth={10} strokeLinecap="round" fill="none" />
      )}
    </g>
  );
};
