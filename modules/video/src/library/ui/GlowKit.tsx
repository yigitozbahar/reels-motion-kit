// GlowKit.tsx: the pieces of the glow-flat style (concept/styles.md). No outlines: a shape is told from its neighbour by
// colour alone, shaded with hard-edged flat tones, and only light is soft.
//   <Sky>       the near-black backdrop with one big soft light behind the subject
//   <Stars>     a field of dots and sparkles, twinkling
//   <Ball>      a flat sphere: three hard-edged tones, the shadow shifted toward purple
//   <Eyes>      big white eyes, a black pupil with two highlights, an optional flat eyelid
//   <Title>     big white type on the frame, popping in; <Tag> is the same inside a <World>, on an object (raw: as
//               written, for symbols like Fe that must not be upper-cased)
//   <Arrow> <Sparkle>, blobPath() and spikePath() for wavy and jagged shapes, mix() and pop() for colour and motion
import React from "react";
import { AbsoluteFill } from "remotion";
import { backOut, clamp, hash, seg } from "../../lib/anim";
import { GLOW, H, MONTSERRAT, W } from "../style";

const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
// a colour between two hex colours
export const mix = (a: string, b: string, k: number) => {
  const A = rgb(a), B = rgb(b), x = clamp(k);
  return `#${A.map((v, i) => (256 + Math.round(v + (B[i] - v) * x)).toString(16).slice(1)).join("")}`;
};

// the scale of a thing popping in at time `at`: past full size, then settling
export const pop = (t: number, at: number, dur = .4) => backOut(seg(t, at, at + dur));

export const Sky: React.FC<{ color?: string; glow?: string; x?: number; y?: number; r?: number; a?: number }> = ({ color = GLOW.night, glow = GLOW.blue, x = W / 2, y = H * .45, r = 900, a = .55 }) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    <AbsoluteFill style={{ opacity: a, background: `radial-gradient(circle ${r}px at ${x}px ${y}px, ${glow}, ${glow}66 35%, transparent 100%)` }} />
  </AbsoluteFill>
);

export const Sparkle: React.FC<{ x: number; y: number; r: number; color?: string; a?: number; rot?: number }> = ({ x, y, r, color = GLOW.white, a = 1, rot = 0 }) => {
  const q = r * .12;
  return <path transform={`translate(${x} ${y}) rotate(${rot})`} opacity={a} fill={color} d={`M0 ${-r}Q${q} ${-q} ${r} 0Q${q} ${q} 0 ${r}Q${-q} ${q} ${-r} 0Q${-q} ${-q} 0 ${-r}Z`} />;
};

export const Stars: React.FC<{ t: number; seed?: number; n?: number; a?: number; colors?: string[] }> = ({ t, seed = 1, n = 140, a = 1, colors = ["#F8F8F8", "#7FB8FF", "#C9A0FF"] }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const h = (k: number) => hash(i * 3.17 + seed * 11.3 + k), x = h(1) * (W + 400) - 200, y = h(2) * (H + 400) - 200;
      const tw = .55 + .45 * Math.sin(t * (1 + h(3) * 2.5) + h(4) * 6.28), c = colors[i % colors.length];
      return i % 11 === 0
        ? <Sparkle key={i} x={x} y={y} r={7 + h(5) * 12} color={c} a={a * tw} rot={t * 8} />
        : <circle key={i} cx={x} cy={y} r={1.2 + h(5) * 2.6} fill={c} opacity={a * tw * .85} />;
    })}
  </g>
);

export const Ball: React.FC<{ id: string; x: number; y: number; r: number; color: string; shade?: string; light?: string; dir?: number; s?: number; children?: React.ReactNode }> = ({ id, x, y, r, color, shade, light, dir = -2.3, s = 1, children }) => {
  const dx = Math.cos(dir) * r, dy = Math.sin(dir) * r;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`}>
      <clipPath id={id}><circle r={r} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <circle r={r} fill={shade ?? mix(color, GLOW.shadow, .6)} />
        <circle cx={dx * .2} cy={dy * .2} r={r * .98} fill={color} />
        <circle cx={dx * .62} cy={dy * .62} r={r * .62} fill={light ?? mix(color, "#FFFFFF", .32)} />
      </g>
      {children}
    </g>
  );
};

// lid: 0 open, 1 shut, in lidColor (the skin around the eye)
export const Eyes: React.FC<{ id: string; x: number; y: number; gap: number; r: number; lookX?: number; lookY?: number; lid?: number; lidColor?: string }> = ({ id, x, y, gap, r, lookX = 0, lookY = 0, lid = 0, lidColor = GLOW.skin }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-1, 1].map((side) => (
      <g key={side} transform={`translate(${side * gap} 0)`}>
        <clipPath id={`${id}${side}`}><circle r={r} /></clipPath>
        <circle r={r} fill={GLOW.white} />
        <g clipPath={`url(#${id}${side})`}>
          <g transform={`translate(${lookX * r * .36} ${lookY * r * .36})`}>
            <circle r={r * .62} fill="#0A0A1E" />
            <circle cx={-r * .22} cy={-r * .24} r={r * .2} fill={GLOW.white} />
            <circle cx={r * .2} cy={r * .16} r={r * .1} fill={GLOW.white} />
          </g>
          {lid > 0 && <rect x={-r} y={-r} width={r * 2} height={r * 2 * lid} fill={lidColor} />}
        </g>
        {lid > .85 && <path d={`M${-r * .8} ${r * .05}Q0 ${r * .5} ${r * .8} ${r * .05}`} fill="none" stroke="#3A1420" strokeWidth={r * .14} strokeLinecap="round" />}
      </g>
    ))}
  </g>
);

export const Title: React.FC<{ t: number; at: number; until?: number; y?: number; size?: number; color?: string; lang?: string; raw?: boolean; children: string }> = ({ t, at, until = Infinity, y = 330, size = 100, color = GLOW.white, lang = "tr", raw = false, children }) => {
  if (t < at || t >= until + .15) return null;
  const s = pop(t, at, .35) * (1 - seg(t, until, until + .15));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: y, transform: `translateY(-50%) scale(${s})`, textAlign: "center", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: -1, color, textShadow: "0 6px 30px rgba(8,8,40,.7)" }}>
        {raw ? children : children.toLocaleUpperCase(lang)}
      </div>
    </AbsoluteFill>
  );
};

export const Tag: React.FC<{ x: number; y: number; size?: number; color?: string; lang?: string; s?: number; a?: number; raw?: boolean; children: string }> = ({ x, y, size = 46, color = GLOW.white, lang = "tr", s = 1, a = 1, raw = false, children }) => (
  <text transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`} opacity={a} textAnchor="middle" dominantBaseline="central" fontFamily={MONTSERRAT} fontWeight={800} fontSize={size} fill={color}>
    {raw ? children : children.toLocaleUpperCase(lang)}
  </text>
);

// a flat block arrow pointing along `rot` degrees, its tip at (x, y)
export const Arrow: React.FC<{ x: number; y: number; size?: number; rot?: number; color?: string; s?: number }> = ({ x, y, size = 60, rot = 0, color = GLOW.white, s = 1 }) => (
  <path transform={`translate(${x} ${y}) rotate(${rot}) scale(${Math.max(0, s) * size / 60})`} fill={color} d="M0 0L-52 -46V-20H-120V20H-52V46Z" />
);

// a closed wavy outline around the origin: lobes waves, amp (0..1 of r) deep, flowing with phase
export const blobPath = (r: number, { lobes = 5, amp = .08, phase = 0, seed = 0, n = 120 }: { lobes?: number; amp?: number; phase?: number; seed?: number; n?: number } = {}) => {
  const pt = (i: number) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + amp * Math.sin(lobes * a + phase + seed) + amp * .5 * Math.sin((lobes * 2 + 1) * a - phase * 1.3 + seed * 2);
    return [Math.cos(a) * r * k, Math.sin(a) * r * k];
  };
  const mid = (i: number) => { const [x0, y0] = pt(i), [x1, y1] = pt(i + 1); return [(x0 + x1) / 2, (y0 + y1) / 2]; };
  let d = `M${mid(n - 1).join(" ")}`;
  for (let i = 0; i < n; i++) { const [x, y] = pt(i), [mx, my] = mid(i); d += `Q${x} ${y} ${mx} ${my}`; }
  return `${d}Z`;
};

// a jagged star, n spikes between rIn and rOut, each spike a different length
export const spikePath = (rIn: number, rOut: number, n = 16, seed = 0) => {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? rIn : rIn + (rOut - rIn) * (.55 + .45 * hash(i + seed));
    d += `${i ? "L" : "M"}${Math.cos(a) * r} ${Math.sin(a) * r}`;
  }
  return `${d}Z`;
};
