// Chopper.tsx: a long, low, black chopper motorcycle seen from the side, facing left, in world coordinates: a raked
// front fork, high handlebars, a teardrop tank, a V-twin engine and two chrome pipes. No brand.
//   (x, y) the ground under its middle; s its scale (1: about 1050 px long)
//   light 0..1   the headlight, and its beam to the left
//   run 0..1     the engine runs: the bike trembles (t drives it), smoke puffs from the pipes
import React from "react";
import { OUT, RED } from "../style";
import { Glow } from "../ui/Frame";

const BODY = "#1B1920", GLOSS = "#4A4556", CHROME = "#C9CED8", CHROME_DK = "#7F8696", TIRE = "#111015", LEATHER = "#3A2A24";

const Wheel: React.FC<{ cx: number; cy: number; r: number; fat?: boolean }> = ({ cx, cy, r, fat }) => {
  const rim = r - (fat ? 36 : 24);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={TIRE} />
      <circle cx={cx} cy={cy} r={rim} fill="#2A2730" />
      {Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return <path key={i} d={`M ${cx} ${cy} L ${cx + Math.cos(a) * rim} ${cy + Math.sin(a) * rim}`} stroke={CHROME} strokeWidth={4} />; })}
      <circle cx={cx} cy={cy} r={24} fill={CHROME} />
    </g>
  );
};

const tube = (d: string, w: number, c: string) => (<><path d={d} fill="none" stroke={OUT.stroke} strokeWidth={w + 12} /><path d={d} fill="none" stroke={c} strokeWidth={w} /></>);
const pipe = (d: string, w = 26) => (<>{tube(d, w, CHROME)}<path d={d} fill="none" stroke="#F4F6FA" strokeWidth={w * .25} opacity={.7} transform="translate(0 -5)" /></>);

export const Chopper: React.FC<{ x: number; y: number; s?: number; light?: number; run?: number; t?: number }> = ({ x, y, s = 1, light = 0, run = 0, t = 0 }) => {
  const jx = run * 2.2 * Math.sin(t * 93), jy = run * 2.6 * Math.sin(t * 71 + 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><linearGradient id="chopper-beam" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stopColor="#FFF4CF" stopOpacity={.55} /><stop offset="1" stopColor="#FFF4CF" stopOpacity={0} /></linearGradient></defs>
      {light > 0 && <path d="M -300 -545 L -2600 -1000 L -2600 300 L -300 -495 Z" fill="url(#chopper-beam)" opacity={light} />}
      <ellipse cx={0} cy={0} rx={560} ry={36} fill="#000" opacity={.55} />
      <g transform={`translate(${jx} ${jy})`} {...OUT}>
        <Wheel cx={340} cy={-135} r={135} fat />
        <Wheel cx={-420} cy={-150} r={150} />
        {tube("M -420 -150 L -250 -540", 30, CHROME)}
        {tube("M -250 -540 Q -80 -500 260 -400", 28, BODY)}
        {tube("M -250 -520 L -150 -260 Q -100 -150 40 -150 L 340 -135", 26, BODY)}
        {tube("M 260 -400 L 340 -135", 24, BODY)}
        {/* the V-twin: the crankcase, two finned cylinders, the air cleaner */}
        <ellipse cx={-40} cy={-215} rx={115} ry={62} fill={CHROME_DK} />
        {[[-28, -135, -90], [28, -25, 20]].map(([a, rx, ox]) => (
          <g key={a} transform={`rotate(${a} ${ox} -300)`}>
            <rect x={rx} y={-400} width={90} height={160} rx={12} fill={CHROME} />
            {[-378, -354, -330, -306, -282].map((fy) => <path key={fy} d={`M ${rx} ${fy} h 90`} stroke={CHROME_DK} strokeWidth={4} />)}
          </g>
        ))}
        <circle cx={-35} cy={-300} r={38} fill={CHROME} />
        <circle cx={-35} cy={-300} r={18} fill={CHROME_DK} />
        {pipe("M -110 -265 Q -170 -150 -60 -128 L 540 -150")}
        {pipe("M 40 -265 Q 60 -175 120 -172 L 560 -190")}
        <ellipse cx={548} cy={-150} rx={10} ry={16} fill="#2B2830" />
        <ellipse cx={568} cy={-190} rx={10} ry={16} fill="#2B2830" />
        {tube("M -150 -205 L -235 -220", 10, CHROME)}
        {/* the tank, the seat, the rear fender and its light */}
        <path d="M -240 -515 Q -170 -600 -10 -568 Q 50 -550 40 -488 Q -90 -470 -240 -490 Z" fill={BODY} />
        <path d="M -200 -545 Q -120 -582 -20 -556" fill="none" stroke={GLOSS} strokeWidth={12} />
        <path d="M 20 -478 Q 130 -440 240 -445 Q 285 -446 290 -415 Q 160 -400 30 -445 Z" fill={LEATHER} />
        <path d="M 210 -235 Q 250 -320 350 -305 Q 455 -290 490 -190 L 455 -182 Q 425 -262 350 -272 Q 270 -282 238 -222 Z" fill={BODY} />
        <rect x={478} y={-232} width={22} height={16} rx={4} fill={RED} />
        {/* the bars and the headlight */}
        {tube("M -255 -545 L -270 -610 L -245 -770 L -170 -780", 18, CHROME)}
        {tube("M -175 -780 L -120 -782", 22, "#151418")}
        <rect x={-280} y={-560} width={60} height={40} rx={8} fill={CHROME_DK} />
        <circle cx={-300} cy={-520} r={48} fill={CHROME} />
        <circle cx={-306} cy={-520} r={34} fill={light > .05 ? "#FFF7DA" : "#6F6C66"} />
        {run > 0 && Array.from({ length: 6 }, (_, i) => {
          const p = (t * .8 + i / 6) % 1;
          return <circle key={i} cx={580 + 160 * p} cy={-175 - 110 * p} r={20 + 80 * p} fill="#8A8794" opacity={(1 - p) * .35 * run} stroke="none" />;
        })}
      </g>
      {light > 0 && <Glow id="chopper-lamp" x={-300 + jx} y={-520 + jy} r={260} color="#FFF0C0" a={light} />}
    </g>
  );
};
