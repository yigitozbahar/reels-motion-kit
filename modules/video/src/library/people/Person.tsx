// Person.tsx: a person in the lamplight style (concept/styles.md), front on or from behind. Stories dress it up as their
// characters. An SVG <g> in world coordinates: (x, y) is between the feet, h the height in px (1000 units inside; the
// head's centre is at −860, so a face close-up is a camera on (x, y − .86h)).
//   hair      'spiky' | 'short' | 'long' | 'ponytail' | 'bun' | 'wavy' (full, swept up and to one side) (glasses: round glasses)
//   top       the colour of the sweater, coat or shirt; collar 'crew' | 'v' (a pale top under it) | 'hood' | 'shirt' | 'gown' | 'zip' (a half-open ribbed zip neck, a black tee under it)
//   face      'flat' | 'sad' | 'smile' (closed) | 'grin' (the mouth wide open, eyes staring: only for whoever isn't what
//             they seem). Nobody else opens their mouth. Worse grins: 'torn' (the corners ripped up towards the ears),
//             'rip' (torn ear to ear, sharp teeth; mouth 0..1 how far it gapes), 'stitched' (torn and crudely sewn), 'bleed' (torn, dark blood running)
//   look      [x, y] −1..1: where the pupils point; tilt: the head's tilt (radians)
//   dark 0..1   the face goes dark while the body stays in the light, the eyes dim pale rings: someone who isn't right.
//               With darkTop it fades instead: darkTop at the top of the head down to dark at the chin, the fade
//               starting darkFrom (0..1) of the way down. darkTint: the colour it darkens to (a warm brown by default)
//   eyeLight    a colour: the pupils burn with it and throw a soft halo ("#E8453C" red, "#F2C14E" yellow)
//   shade 0..1  the whole figure goes dark, out of the light; glow 0..1 lights the eyes in that dark
//   back      seen from behind: hair over the head, no face
//   tear 0..1   a tear runs down the left cheek; wounds 0..1  scratches on the face and the arms
//   bags        the dark circles under the eyes (false: a rested face, for a happy memory)
//   lids 0..1   heavy upper eyelids (from .9: shut); brows: how thick (1 by default); brow [raise 0..1, tilt −1..1]: lifts them, and tilts
//               their inner ends up (worried, scared) or down (angry). Without it they follow `face`
import React from "react";
import { LAMP, OUT } from "../style";

export type PersonProps = {
  x: number; y: number; h: number;
  hair?: "spiky" | "short" | "long" | "ponytail" | "bun" | "wavy"; hairColor?: string; glasses?: boolean;
  top?: string; collar?: "crew" | "v" | "hood" | "shirt" | "gown" | "zip"; legs?: string; skin?: string;
  face?: "flat" | "sad" | "smile" | "grin" | "torn" | "rip" | "stitched" | "bleed"; look?: [number, number]; tilt?: number;
  dark?: number; darkTop?: number; darkFrom?: number; darkTint?: string; shade?: number; glow?: number; back?: boolean; tear?: number; wounds?: number; bags?: boolean; mouth?: number; eyeLight?: string; arms?: React.ReactNode; lids?: number; brows?: number; brow?: [number, number];
};

const HEAD = -860, R = 118, FACE_DARK = "#211B16";

const mix = (a: string, b: string, k: number) => {
  const p = (c: string, i: number) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16);
  return "#" + [0, 1, 2].map((i) => ("0" + Math.round(p(a, i) + (p(b, i) - p(a, i)) * k).toString(16)).slice(-2)).join("");
};

export const Person: React.FC<PersonProps> = (p) => {
  const { x, y, h, hair = "short", hairColor = LAMP.hair, glasses = false, top = LAMP.charcoal, collar = "crew", legs = LAMP.trousers,
    skin = LAMP.skin, face = "flat", look = [0, 0], tilt = 0, dark = 0, darkTop, darkFrom = 0, darkTint = FACE_DARK, shade = 0, glow = 0, back = false, tear = 0, wounds = 0, bags = true, mouth = .5, eyeLight, lids = 0, brows = 1, brow } = p;
  const gown = collar === "gown", grin = face === "grin" || face === "torn" || face === "rip" || face === "stitched" || face === "bleed";
  const torn = face === "torn" || face === "stitched" || face === "bleed";
  const fade = darkTop !== undefined, darkAt = (k: number) => fade ? darkTop! + (dark - darkTop!) * Math.max(0, (k - darkFrom) / (1 - darkFrom)) : dark;
  const eyeDark = darkAt(.46), gradId = `face-${Math.round((darkTop ?? 0) * 100)}-${Math.round(dark * 100)}-${Math.round(darkFrom * 100)}-${skin.slice(1)}-${darkTint.slice(1)}`;
  const faceSkin = fade ? `url(#${gradId})` : mix(skin, darkTint, dark), white = mix("#FBF8F1", "#6B655B", eyeDark), er = grin ? 31 : 25, pr = grin ? 7 : 9;
  const arm = (d: string) => (<><path d={d} fill="none" stroke={OUT.stroke} strokeWidth={96} strokeLinecap="round" /><path d={d} fill="none" stroke={top} strokeWidth={82} strokeLinecap="round" /></>);
  // lids from .9 up: the eye is shut, one curved line
  const eyes = (lit: boolean) => [-1, 1].map((s) => lids >= .9 ? <path key={s} d={`M ${s * 46 - 24} ${HEAD - 8} Q ${s * 46} ${HEAD + 10} ${s * 46 + 24} ${HEAD - 8}`} fill="none" strokeWidth={7} /> : (
    <g key={s}>
      <circle cx={s * 46} cy={HEAD - 8} r={er} fill={lit ? "#F4EFE2" : white} strokeWidth={5} />
      {eyeLight ? <>
        <circle cx={s * 46 + look[0] * 10} cy={HEAD - 8 + look[1] * 9} r={pr * 3.2} fill={`url(#eye-${eyeLight.slice(1)})`} stroke="none" />
        <circle cx={s * 46 + look[0] * 10} cy={HEAD - 8 + look[1] * 9} r={pr * 1.15} fill={eyeLight} stroke="none" />
        <circle cx={s * 46 + look[0] * 10 - pr * .35} cy={HEAD - 8 + look[1] * 9 - pr * .35} r={pr * .35} fill="#FFF6E0" stroke="none" />
      </> : <circle cx={s * 46 + look[0] * 10} cy={HEAD - 8 + look[1] * 9} r={pr} fill={OUT.stroke} stroke="none" />}
      {lids > 0 && (() => {
        const dy = -er + 2 * er * lids, hw = Math.sqrt(er * er - dy * dy), y = HEAD - 8 + dy;
        return <path d={`M ${s * 46 - hw} ${y} A ${er} ${er} 0 ${lids > .5 ? 1 : 0} 1 ${s * 46 + hw} ${y} Z`} fill={mix(skin, LAMP.skinDk, .35)} strokeWidth={5} />;
      })()}
    </g>
  ));
  const headTf = `rotate(${(tilt * 180) / Math.PI} 0 -740)`;
  const body = (
    <g {...OUT}>
      {/* the hair that falls behind the shoulders goes first, so the neck and the body cover it (from behind it falls over the back: below) */}
      <g transform={headTf}>
        {hair === "long" && !back && <path d={`M -150 ${HEAD - 40} Q -150 ${HEAD - 150} 0 ${HEAD - 152} Q 150 ${HEAD - 150} 150 ${HEAD - 40} L 172 -640 Q 0 -615 -172 -640 Z`} fill={hairColor} />}
        {hair === "ponytail" && <path d={`M 90 ${HEAD - 90} Q 210 ${HEAD - 40} 170 ${HEAD + 120} Q 150 ${HEAD + 40} 110 ${HEAD - 20} Z`} fill={hairColor} />}
        {hair === "bun" && <circle cx={0} cy={HEAD - 132} r={48} fill={hairColor} />}
      </g>
      {/* legs and shoes, or the hem of a gown */}
      {gown ? (
        <path d="M -150 -700 L 150 -700 L 205 -40 Q 0 -20 -205 -40 Z" fill={top} />
      ) : (
        <>
          {[-1, 1].map((s) => <g key={s}><rect x={s * 70 - 52} y={-360} width={104} height={330} fill={legs} /><ellipse cx={s * 74} cy={-26} rx={66} ry={26} fill="#1A1820" /></g>)}
          <path d="M -165 -700 L 165 -700 L 178 -330 Q 0 -310 -178 -330 Z" fill={top} />
        </>
      )}
      {collar === "v" && <path d="M -70 -712 L 0 -590 L 70 -712 Z" fill={mix(LAMP.cream, "#000000", .25)} />}
      {collar === "crew" && <path d="M -62 -712 Q 0 -680 62 -712" fill="none" strokeWidth={5} />}
      {collar === "hood" && <><path d="M -105 -712 Q 0 -650 105 -712" fill="none" strokeWidth={6} /><path d="M -34 -680 V -580 M 34 -680 V -580" strokeWidth={5} /><path d="M -95 -470 H 95 L 80 -380 H -80 Z" fill="none" strokeWidth={5} /></>}
      {collar === "shirt" && <><path d="M -60 -712 L -10 -660 L 0 -700 L 10 -660 L 60 -712" fill={LAMP.cream} strokeWidth={5} /><path d="M 0 -690 V -340" strokeWidth={4} />{[-620, -540, -460, -390].map((by) => <circle key={by} cx={16} cy={by} r={7} fill={LAMP.cream} strokeWidth={3} />)}</>}
      {gown && <path d="M -60 -705 Q 0 -660 60 -705" fill="none" strokeWidth={5} />}
      {/* the arms hang, the hands at the hips (arms replaces them: a story's own pose) */}
      {p.arms ?? <>{arm("M -160 -680 Q -205 -540 -190 -390")}{arm("M 160 -680 Q 205 -540 190 -390")}{[-1, 1].map((s) => <circle key={s} cx={s * 190} cy={-360} r={34} fill={skin} />)}</>}
      {wounds > 0 && !p.arms && <g stroke="#8E1F22" strokeWidth={7} strokeLinecap="round" opacity={wounds}>{[[-205, -560, 28], [-196, -470, -22], [188, -600, 24], [200, -500, -26], [192, -430, 20]].map(([wx, wy, d], i) => <path key={i} d={`M ${wx - 16} ${wy} l 32 ${d}`} />)}</g>}
      <rect x={-34} y={-760} width={68} height={60} fill={back ? hairColor : mix(skin, darkTint, (fade ? darkAt(1) : dark) * .7)} />
      {collar === "zip" && <>
        <path d="M -40 -700 L 0 -575 L 40 -700 Z" fill="#101014" />
        <path d="M -92 -742 Q -46 -722 -30 -716 L 0 -600 L -112 -676 Z" fill={top} /><path d="M 92 -742 Q 46 -722 30 -716 L 0 -600 L 112 -676 Z" fill={top} />
        <path d="M 0 -600 V -470" strokeWidth={5} /><rect x={-7} y={-612} width={14} height={30} rx={4} fill="#8E8D88" strokeWidth={3} />
        <g strokeWidth={3} opacity={.45} fill="none">{[-140, -105, -70, -35, 35, 70, 105, 140].map((rx) => <path key={rx} d={`M ${rx} -640 L ${rx * 1.05} -335`} />)}</g>
      </>}
      {/* the head */}
      <g transform={headTf}>
        {back && <path d={`M -150 ${HEAD - 40} Q -150 ${HEAD - 150} 0 ${HEAD - 152} Q 150 ${HEAD - 150} 150 ${HEAD - 40} L 165 -560 Q 0 -530 -165 -560 Z`} fill={hairColor} />}
        {!back && [-1, 1].map((s) => <circle key={s} cx={s * R} cy={HEAD + 5} r={22} fill={faceSkin} />)}
        <circle cx={0} cy={HEAD} r={R} fill={back ? hairColor : faceSkin} />
        {!back && (
          <>
            {[-1, 1].map((s) => <ellipse key={s} cx={s * 46} cy={HEAD + 2} rx={44} ry={38} fill={LAMP.skinDk} opacity={bags ? .55 * (1 - eyeDark) : 0} stroke="none" />)}
            {eyes(false)}
            {!grin && [-1, 1].map((s) => <path key={s} d={brow ? `M ${s * 24} ${HEAD - 44 - brow[0] * 14 - brow[1] * 12} L ${s * 68} ${HEAD - 46 - brow[0] * 14 + brow[1] * 8}` : face === "sad" ? `M ${s * 22} ${HEAD - 48} L ${s * 66} ${HEAD - 38}` : `M ${s * 24} ${HEAD - 44} L ${s * 68} ${HEAD - 46}`} strokeWidth={7 * brows} />)}
            <path d={`M 4 ${HEAD + 2} Q -14 ${HEAD + 32} 8 ${HEAD + 36}`} fill="none" strokeWidth={5} />
            {face === "flat" && <path d={`M -26 ${HEAD + 68} H 26`} strokeWidth={6} />}
            {face === "sad" && <path d={`M -28 ${HEAD + 74} Q 0 ${HEAD + 60} 28 ${HEAD + 74}`} fill="none" strokeWidth={6} />}
            {face === "smile" && <path d={`M -36 ${HEAD + 60} Q 0 ${HEAD + 84} 36 ${HEAD + 60}`} fill="none" strokeWidth={6} />}
            {torn && [-1, 1].map((s) => {
              const d = `M ${s * 74} ${HEAD + 50} L ${s * 90} ${HEAD + 34} L ${s * 86} ${HEAD + 24} L ${s * 102} ${HEAD + 12} L ${s * 97} ${HEAD + 2} L ${s * 112} ${HEAD - 10}`;
              return <g key={s}><path d={d} fill="none" stroke={OUT.stroke} strokeWidth={24} strokeLinejoin="miter" /><path d={d} fill="none" stroke="#4A1418" strokeWidth={13} strokeLinejoin="miter" />
                {face === "stitched" && [[84, 34], [94, 18], [104, 4]].map(([sx, sy], i) => <path key={i} d={`M ${s * (sx - 13)} ${HEAD + sy - 9} L ${s * (sx + 13)} ${HEAD + sy + 9} M ${s * (sx - 13)} ${HEAD + sy + 9} L ${s * (sx + 13)} ${HEAD + sy - 9}`} stroke="#D8D0BE" strokeWidth={4} />)}
                {face === "bleed" && [[78, 56, 70], [96, 22, 48]].map(([bx, by, len], i) => <path key={i} d={`M ${s * bx} ${HEAD + by} V ${HEAD + by + len}`} stroke="#5A1216" strokeWidth={9} strokeLinecap="round" />)}
              </g>;
            })}
            {face === "rip" && (() => {
              // torn ear to ear, low on the face; a band of teeth on each lip (the upper one's points down, the lower one's
              // up, mirror images), the dark of the mouth between them. mouth 0..1: how far it gapes
              const lip = (x: number, half: number, y0: number, y1: number) => { const u = (x / half + 1) / 2; return y0 * (1 - u) ** 2 + 2 * y1 * u * (1 - u) + y0 * u * u; };
              const low = 64 + 110 * mouth, top = (x: number) => lip(x, 92, 40, 64), bottom = (x: number) => lip(x, 100, 50, low);
              const band = (edge: (x: number) => number, from: number, to: number, n: number, dir: number) => {
                const xs = Array.from({ length: n + 1 }, (_, i) => from + (to - from) * i / n);
                const saw = xs.slice().reverse().map((x, i, r) => i === 0 ? `L ${x} ${HEAD + edge(x) + dir * 6}` : `L ${(x + r[i - 1]) / 2} ${HEAD + edge((x + r[i - 1]) / 2) + dir * 18} L ${x} ${HEAD + edge(x) + dir * 6}`).join(" ");
                return `M ${xs.map((x) => `${x} ${HEAD + edge(x)}`).join(" L ")} ${saw} Z`;
              };
              return <>
                <path d={`M -112 ${HEAD + 18} L -102 ${HEAD + 30} L -96 ${HEAD + 28} L -92 ${HEAD + 40} Q 0 ${HEAD + 64} 92 ${HEAD + 40} L 96 ${HEAD + 28} L 102 ${HEAD + 30} L 112 ${HEAD + 18} L 106 ${HEAD + 40} L 100 ${HEAD + 50} Q 0 ${HEAD + low} -100 ${HEAD + 50} L -106 ${HEAD + 40} Z`} fill="#3A0E12" strokeWidth={6} />
                <path d={band(top, -86, 86, 12, 1)} fill="#D8D0BE" strokeWidth={3} />
                <path d={band(bottom, -86, 86, 12, -1)} fill="#D8D0BE" strokeWidth={3} />
              </>;
            })()}
            {grin && face !== "rip" && <><path d={`M -78 ${HEAD + 44} Q 0 ${HEAD + 58} 78 ${HEAD + 44} Q 66 ${HEAD + 112} 0 ${HEAD + 118} Q -66 ${HEAD + 112} -78 ${HEAD + 44} Z`} fill="#4A1418" strokeWidth={6} /><path d={`M -70 ${HEAD + 50} Q 0 ${HEAD + 63} 70 ${HEAD + 50} L 64 ${HEAD + 64} Q 0 ${HEAD + 77} -64 ${HEAD + 64} Z`} fill="#D8D0BE" strokeWidth={3} /></>}
            {glasses && <g fill="none" strokeWidth={6}>{[-1, 1].map((s) => <circle key={s} cx={s * 46} cy={HEAD - 8} r={grin ? 38 : 34} />)}<path d={`M -12 ${HEAD - 10} H 12`} /></g>}
            {wounds > 0 && <g stroke="#9A2226" strokeWidth={6} strokeLinecap="round" fill="none" opacity={wounds}><path d={`M 52 ${HEAD + 30} l 34 -20 M 60 ${HEAD + 46} l 28 -16`} /><path d={`M -90 ${HEAD - 72} l 40 14`} /><path d={`M -40 ${HEAD + 88} l 18 10`} /></g>}
            {tear > 0 && <path d={`M -58 ${HEAD + 22} q -6 ${24 * tear} 0 ${48 * tear}`} fill="none" stroke="#BFD6E4" strokeWidth={9} strokeLinecap="round" />}
          </>
        )}
        {/* the hair over the forehead */}
        {hair === "wavy" && !back && <>
          <path d={`M -122 ${HEAD + 8} C -142 ${HEAD - 30} -150 ${HEAD - 90} -118 ${HEAD - 128} C -100 ${HEAD - 164} -50 ${HEAD - 176} -6 ${HEAD - 166} C 28 ${HEAD - 186} 88 ${HEAD - 178} 116 ${HEAD - 140} C 146 ${HEAD - 104} 142 ${HEAD - 46} 124 ${HEAD + 10} C 124 ${HEAD - 28} 110 ${HEAD - 62} 84 ${HEAD - 78} C 58 ${HEAD - 64} 14 ${HEAD - 66} -14 ${HEAD - 96} C -36 ${HEAD - 70} -82 ${HEAD - 60} -102 ${HEAD - 38} C -112 ${HEAD - 26} -118 ${HEAD - 10} -122 ${HEAD + 8} Z`} fill={hairColor} />
          <path d={`M 34 ${HEAD - 178} C 52 ${HEAD - 200} 86 ${HEAD - 200} 104 ${HEAD - 180} C 84 ${HEAD - 186} 62 ${HEAD - 182} 52 ${HEAD - 170} Z`} fill={hairColor} strokeWidth={5} />
          <g fill="none" stroke={mix(hairColor, "#FFFFFF", .16)} strokeWidth={7}>
            <path d={`M -102 ${HEAD - 72} C -86 ${HEAD - 124} -40 ${HEAD - 150} 16 ${HEAD - 140}`} />
            <path d={`M -56 ${HEAD - 88} C -40 ${HEAD - 112} -6 ${HEAD - 126} 40 ${HEAD - 120}`} />
            <path d={`M 28 ${HEAD - 92} C 54 ${HEAD - 110} 88 ${HEAD - 114} 112 ${HEAD - 94}`} />
            <path d={`M 52 ${HEAD - 158} C 80 ${HEAD - 164} 106 ${HEAD - 150} 120 ${HEAD - 120}`} />
          </g>
        </>}
        {hair === "spiky" && <path d={`M -125 ${HEAD - 10} L -128 ${HEAD - 80} L -150 ${HEAD - 110} L -95 ${HEAD - 120} L -90 ${HEAD - 170} L -40 ${HEAD - 135} L 0 ${HEAD - 190} L 30 ${HEAD - 135} L 85 ${HEAD - 175} L 90 ${HEAD - 118} L 150 ${HEAD - 120} L 128 ${HEAD - 70} L 126 ${HEAD - 10} Q 110 ${HEAD - 60} 60 ${HEAD - 70} L 30 ${HEAD - 50} L 0 ${HEAD - 75} L -50 ${HEAD - 55} Q -100 ${HEAD - 70} -125 ${HEAD - 10} Z`} fill={hairColor} />}
        {(hair === "short" || hair === "ponytail" || hair === "bun") && !back && <path d={`M -122 ${HEAD - 5} Q -128 ${HEAD - 125} 0 ${HEAD - 128} Q 128 ${HEAD - 125} 122 ${HEAD - 5} Q 100 ${HEAD - 70} 20 ${HEAD - 78} Q -60 ${HEAD - 80} -122 ${HEAD - 5} Z`} fill={hairColor} />}
        {hair === "long" && !back && <path d={`M -130 ${HEAD + 40} Q -140 ${HEAD - 128} 0 ${HEAD - 130} Q 140 ${HEAD - 128} 130 ${HEAD + 40} Q 120 ${HEAD - 60} 30 ${HEAD - 82} Q -10 ${HEAD - 40} -70 ${HEAD - 70} Q -120 ${HEAD - 40} -130 ${HEAD + 40} Z`} fill={hairColor} />}
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${h / 1000})`}>
      {fade && <defs><linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={0} y1={HEAD - R} x2={0} y2={HEAD + R}>{[0, darkFrom, (1 + darkFrom) / 2, 1].map((k) => <stop key={k} offset={k} stopColor={mix(skin, darkTint, darkAt(k))} />)}</linearGradient></defs>}
      {eyeLight && <defs><radialGradient id={`eye-${eyeLight.slice(1)}`}><stop offset="0" stopColor={eyeLight} stopOpacity={.9} /><stop offset=".4" stopColor={eyeLight} stopOpacity={.35} /><stop offset="1" stopColor={eyeLight} stopOpacity={0} /></radialGradient></defs>}
      <g style={shade > 0 ? { filter: `brightness(${1 - .82 * shade})` } : undefined}>{body}</g>
      {glow > 0 && !back && <g transform={headTf} opacity={glow} {...OUT}>{eyes(true)}</g>}
    </g>
  );
};
