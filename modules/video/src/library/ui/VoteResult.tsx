// VoteResult.tsx: the opening of a part 2+: last part's vote, as two bars filling to their percentages. Use it when the
// vote was close (concept/format-guide.md); a clear win only needs the winning option.
//   fill 0..1    the bars grow and the numbers count up
//   win 0..1     the winner's bar turns red and lifts
import React from "react";
import { AbsoluteFill } from "remotion";
import { backOut, ease } from "../../lib/anim";
import { ANTON, CREAM, INK, RED } from "../style";

export type VoteOption = { letter: string; label: string; pct: number };

export const VoteResult: React.FC<{ title: string; options: [VoteOption, VoteOption]; fill: number; win?: number; pop?: number; y?: number }> = ({ title, options, fill, win = 0, pop = 1, y = 520 }) => {
  const best = options[0].pct >= options[1].pct ? 0 : 1, f = ease(fill);
  const text = (size: number, color = CREAM): React.CSSProperties => ({ fontFamily: ANTON, fontSize: size, color, WebkitTextStroke: `${size * .1}px ${INK}`, paintOrder: "stroke fill", lineHeight: 1.05 });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: y, left: 90, right: 90, display: "flex", flexDirection: "column", gap: 54, transform: `scale(${backOut(pop)})`, opacity: Math.min(1, pop * 3) }}>
        <div style={{ ...text(84), textAlign: "center" }}>{title}</div>
        {options.map((o, i) => {
          const hi = i === best ? win : 0;
          return (
            <div key={o.letter} style={{ transform: `scale(${1 + .04 * hi})` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
                <span style={text(120, i === best && hi > .5 ? RED : CREAM)}>{o.letter}</span>
                <span style={{ ...text(58), flex: 1 }}>{o.label}</span>
                <span style={text(96, i === best && hi > .5 ? RED : CREAM)}>%{Math.round(o.pct * f)}</span>
              </div>
              <div style={{ height: 46, borderRadius: 23, background: "rgba(24,20,32,.9)", border: `5px solid ${CREAM}`, overflow: "hidden", marginTop: 10 }}>
                <div style={{ height: "100%", width: `${o.pct * f}%`, background: i === best && hi > .5 ? RED : "#8B96A0" }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
