// Counter.tsx: a HUD number with a small label above it ("HAYATTA / 10.000"), centred at (x, y) in screen space.
// The number is grouped the narration's way (tr: 10.000); alarm 0..1 turns it red.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ANTON, CREAM, INK, RED } from "../style";

export const Counter: React.FC<{ label: string; value: number; lang?: string; x?: number; y?: number; alarm?: number; a?: number }> = ({ label, value, lang = "tr", x = 540, y = 300, alarm = 0, a = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: a }}>
    <div style={{ position: "absolute", left: x - 400, width: 800, top: y, transform: "translateY(-50%)", textAlign: "center", fontFamily: ANTON, lineHeight: 1 }}>
      <div style={{ fontSize: 40, letterSpacing: 6, color: CREAM, opacity: .75 }}>{label}</div>
      <div style={{ fontSize: 120, color: alarm > .5 ? RED : CREAM, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>{Math.round(value).toLocaleString(lang)}</div>
    </div>
  </AbsoluteFill>
);
