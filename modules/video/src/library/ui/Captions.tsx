// Captions.tsx: word-by-word captions synced to the narration. Shows the phrase being spoken at time t, the word being
// said right now in red, a little bigger; the words still to come dimmed. A phrase ends at a sentence end, at a pause
// in the voice, or after maxWords; it stays up until the next one starts.
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { Narration, Word } from "../../lib/narration";
import { ANTON, CREAM, GLOW, INK, MONTSERRAT, RED } from "../style";

type Page = { words: (Word & { end: number })[]; t0: number; t1: number };

const paginate = (words: Word[], maxWords: number, hold: number): Page[] => {
  const pages: Page[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1], page = pages[pages.length - 1];
    if (!page || /[.!?…:]["'”’»)]*$/.test(prev.w) || w.t0 - prev.t1 > .35 || page.words.length >= maxWords) pages.push({ words: [{ ...w, end: 0 }], t0: w.t0, t1: 0 });
    else page.words.push({ ...w, end: 0 });
  });
  pages.forEach((p, i) => {
    const last = p.words[p.words.length - 1], next = pages[i + 1];
    p.t1 = next && next.t0 - last.t1 < hold ? next.t0 : last.t1 + hold;
    p.words.forEach((w, j) => { w.end = j + 1 < p.words.length ? p.words[j + 1].t0 : p.t1; });
  });
  return pages;
};

// off: time spans with no captions (an alert or a note fills the frame, and the narrator reads it out)
// plain: quiet explainer captions: white sentence-case Montserrat, no outline, no red, no pop
export const Captions: React.FC<{ nar: Narration; t: number; y?: number; size?: number; maxWords?: number; off?: [number, number][]; plain?: boolean }> = ({ nar, t, y = 1440, size = 90, maxWords = 3, off = [], plain = false }) => {
  const pages = useMemo(() => paginate(nar.words, maxWords, .45), [nar, maxWords]);
  const p = pages.find((q) => t >= q.t0 - .06 && t < q.t1);
  if (!p || off.some(([a, b]) => t >= a && t < b)) return null;
  if (plain) return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, right: 150, top: y, transform: "translateY(-50%)", textAlign: "center", fontFamily: MONTSERRAT, fontWeight: 700, fontSize: size, lineHeight: 1.2, color: GLOW.white, textShadow: "0 3px 18px rgba(8,8,40,.95), 0 0 6px rgba(8,8,40,.8)" }}>
        {p.words.map((w) => <span key={w.t0} style={{ opacity: t >= w.t0 ? 1 : .4 }}>{w.w} </span>)}
      </div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 80, right: 140, top: y, transform: "translateY(-50%)", display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * .26, lineHeight: 1.08 }}>
        {p.words.map((w) => {
          const now = t >= w.t0 && t < w.end, said = t >= w.t0, pop = now ? 1.04 + .1 * Math.exp(-(t - w.t0) * 9) : 1;
          return (
            <span key={w.t0} style={{ fontFamily: ANTON, fontSize: size, color: now ? RED : CREAM, opacity: said ? 1 : .38, display: "inline-block", transform: `scale(${pop})`, WebkitTextStroke: `${size * .11}px ${INK}`, paintOrder: "stroke fill", textShadow: `0 ${size * .06}px 0 ${INK}` }}>
              {w.w.toLocaleUpperCase(nar.lang ?? "tr")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
