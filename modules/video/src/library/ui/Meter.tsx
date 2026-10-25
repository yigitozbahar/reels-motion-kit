// Meter.tsx: a split bar showing two shares against a threshold line (a vote: red | undecided | blue, and 50%).
// Screen space: centred at (x, y), w wide. a and b are the shares 0..1 from each end; mark is the threshold.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ANTON, CREAM, INK } from "../style";

export const Meter: React.FC<{ a: number; b: number; colA: string; colB: string; x?: number; y?: number; w?: number; mark?: number; markLabel?: string; alpha?: number }> = ({ a, b, colA, colB, x = 540, y = 1250, w = 800, mark = .5, markLabel = "%50", alpha = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: alpha }}>
    <div style={{ position: "absolute", left: x - w / 2, top: y - 26, width: w, height: 52, borderRadius: 26, background: "#3A3F4E", border: `6px solid ${INK}`, overflow: "hidden", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${a * 100}%`, background: colA }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${b * 100}%`, background: colB }} />
    </div>
    <div style={{ position: "absolute", left: x - w / 2 + w * mark - 3, top: y - 50, width: 6, height: 100, background: CREAM, boxShadow: `0 0 0 3px ${INK}` }} />
    <div style={{ position: "absolute", left: x - w / 2 + w * mark - 100, width: 200, top: y + 54, textAlign: "center", fontFamily: ANTON, fontSize: 40, color: CREAM }}>{markLabel}</div>
  </AbsoluteFill>
);
