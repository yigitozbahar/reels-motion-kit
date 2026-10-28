// Rain.tsx: rain over the whole frame, streaks falling at a slant, a pure function of t. a: how heavy it looks (0..1).
import React from "react";
import { AbsoluteFill } from "remotion";
import { hash } from "../../lib/anim";
import { H, W } from "../style";

export const Rain: React.FC<{ t: number; a?: number; n?: number; color?: string }> = ({ t, a = 1, n = 90, color = "#9AA8D0" }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: a }}>
    <svg width={W} height={H}>
      {Array.from({ length: n }, (_, i) => {
        const span = H + 300, y = ((hash(i * 2.1) * span + t * 1900 * (.8 + .5 * hash(i * 5.3))) % span) - 150, x = hash(i * 1.3) * (W + 400) - 100 - y * .2;
        return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 70} stroke={color} strokeWidth={2 + 2 * hash(i * 7.7)} opacity={.25 + .4 * hash(i * 3.3)} strokeLinecap="round" />;
      })}
    </svg>
  </AbsoluteFill>
);
