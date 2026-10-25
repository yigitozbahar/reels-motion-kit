// ChoiceCard.tsx: the end of every part but the last: a question, two boxes (A and B, each with a short label), and a
// footer calling for comments. pop 0..1 brings the card in; hiA / hiB light one box (as the narrator reads it);
// footer and follow 0..1 fade in the two footer lines.
import React from "react";
import { AbsoluteFill } from "remotion";
import { backOut } from "../../lib/anim";
import { ANTON, CREAM, INK, RED } from "../style";

export const ChoiceCard: React.FC<{ title: string; a: string; b: string; pop: number; hiA?: number; hiB?: number; footer?: string; follow?: string; footerA?: number; followA?: number; y?: number }> = ({ title, a, b, pop, hiA = 0, hiB = 0, footer, follow, footerA = 0, followA = 0, y = 520 }) => {
  const k = backOut(pop);
  const text = (size: number, color = CREAM): React.CSSProperties => ({ fontFamily: ANTON, fontSize: size, color, WebkitTextStroke: `${size * .1}px ${INK}`, paintOrder: "stroke fill", textAlign: "center", lineHeight: 1.05 });
  const box = (L: string, label: string, hi: number) => (
    <div style={{ width: 400, height: 400, borderRadius: 30, background: hi ? "rgba(70,22,28,.92)" : "rgba(24,20,32,.9)", border: `${6 + 4 * hi}px solid ${hi ? RED : CREAM}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, transform: `scale(${1 + .05 * hi})`, boxShadow: hi ? `0 0 60px rgba(232,69,60,.45)` : "none" }}>
      <div style={text(170, RED)}>{L}</div>
      <div style={{ ...text(58), whiteSpace: "pre-line" }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 46, transform: `scale(${k})`, opacity: Math.min(1, pop * 3) }}>
        <div style={text(104)}>{title}</div>
        <div style={{ display: "flex", gap: 40 }}>{box("A", a, hiA)}{box("B", b, hiB)}</div>
        {footer && <div style={{ ...text(56), opacity: footerA }}>{footer}</div>}
        {follow && <div style={{ ...text(42, RED), opacity: followA, marginTop: -26 }}>{follow}</div>}
      </div>
    </AbsoluteFill>
  );
};
