// Receipt.tsx: a paper slip held up close (760×540 px; place it with the wrapper's style). Its front is a printed form
// with a signature; flip 0..1 turns it over (a 3D turn) to a handwritten note on the back, its lines fading in one by
// one (each [text, a 0..1]; mark: the index of a line to underline in red, and how far, 0..1).
import React from "react";
import { CAVEAT, ROBOTO } from "../style";

export type ReceiptFront = { header: string; title: string; rows: [string, string][]; signer: string; role: string };

export const Receipt: React.FC<{ front: ReceiptFront; back: [string, number][]; flip?: number; mark?: [number, number]; style?: React.CSSProperties }> = ({ front, back, flip = 0, mark, style }) => {
  const side: React.CSSProperties = { position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(160deg, #F3EBD6, #E6DAB9)", border: "3px solid #9C8E70", boxShadow: "0 30px 80px rgba(0,0,0,.55)", boxSizing: "border-box" };
  return (
    <div style={{ position: "absolute", width: 760, height: 540, perspective: 1800, ...style }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateZ(-2deg) rotateY(${flip * 180}deg)` }}>
        <div style={{ ...side, fontFamily: ROBOTO, color: "#3A3328", padding: "34px 46px" }}>
          <div style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: "#5E5444", letterSpacing: 2 }}>{front.header}</div>
          <div style={{ textAlign: "center", fontSize: 46, fontWeight: 700, color: "#2B2233", marginTop: 6 }}>{front.title}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 10, marginTop: 30, fontSize: 27 }}>
            {front.rows.map(([a, b], i) => <React.Fragment key={i}><div>{a}</div><div style={{ textAlign: "right" }}>{b}</div></React.Fragment>)}
          </div>
          <div style={{ borderTop: "2px dashed #9C8E70", marginTop: 26 }} />
          <div style={{ position: "absolute", right: 70, bottom: 30, width: 260, textAlign: "center" }}>
            <div style={{ fontSize: 22, color: "#5E5444" }}>{front.role}</div>
            <svg width={260} height={90} viewBox="0 0 260 90"><path d="M 20 70 C 40 10, 60 10, 70 55 S 100 85, 115 30 S 150 15, 160 60 S 200 70, 215 40 L 245 35" fill="none" stroke="#1F2A6B" strokeWidth={4} strokeLinecap="round" /></svg>
            <div style={{ fontSize: 22, color: "#5E5444" }}>{front.signer}</div>
          </div>
        </div>
        <div style={{ ...side, transform: "rotateY(180deg)", padding: "50px 60px", fontFamily: CAVEAT, color: "#22285C" }}>
          {back.map(([s, a], i) => (
            <div key={i} style={{ fontSize: 76, lineHeight: 1.12, opacity: a, transform: `rotate(${-2 + (i % 2) * 1.5}deg) translateX(${(i % 2) * 18}px)`, position: "relative", display: "inline-block", width: "100%" }}>
              {s}
              {mark && mark[0] === i && <div style={{ position: "absolute", left: 0, bottom: 4, height: 7, width: `${70 * mark[1]}%`, background: "#C0392B", borderRadius: 4, transform: "rotate(-1deg)" }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
