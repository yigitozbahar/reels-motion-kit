// YildizP1.tsx: "Sen yıldız tozusun", an explainer in the glow-flat style (concept/styles.md), no
// story and no vote. Where your atoms came from. Every shot is timed to the narration's words (Q below).
//   hook     you, atoms circling you: older than the Earth
//   bang     the universe begins: only hydrogen and helium · nothing else · so no you
//   gather   gravity pulls the gas in, the first star lights
//   furnace  the star cut open: its layers fuse, H → He → C, O → Fe
//   dying    iron gives no energy: the gauge falls, the star goes dark
//   boom     the core collapses, it explodes · brighter than a galaxy · everything scatters
//   birth    from the dust, the Sun and the Earth
//   body     the iron, oxygen and carbon in you came from a star · you, stardust, watching this
import React, { useMemo } from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Captions } from "../../library/ui/Captions";
import { Cam, Fill, Glow, Layer, World } from "../../library/ui/Frame";
import { Arrow, Ball, blobPath, Eyes, mix, pop, Sky, Sparkle, spikePath, Stars, Tag, Title } from "../../library/ui/GlowKit";
import { Sfx } from "../../library/ui/Sfx";
import { ANTON, CREAM, GLOW as G } from "../../library/style";
import { ease, easeIn, easeOut, hash, lerp, seg, shake } from "../../lib/anim";
import { cueAt, Narration } from "../../lib/narration";
import { StoryPart } from "../../lib/story";

// your account, small at the top left, just under Instagram's top bar
const HANDLE = "@username";

const cues = (nar: Narration) => {
  const at = (raw: string, n = 0) => cueAt(nar, raw, n), last = nar.words[nar.words.length - 1];
  return {
    older: at("Dünya'dan"), bang: at("Evren"), two: at("iki"), h: at("hidrojen"), he: at("helyum."), c: at("Karbon"), o: at("Oksijen"), fe: at("Demir"),
    noYou: at("Yani"), gather: at("Sonra"), squeeze: at("sıkıştırdı"), lit: at("yandı."), star: at("Bir"), oven: at("fırındır."), h2: at("Hidrojeni"),
    he2: at("helyumu"), c2: at("karbona"), big: at("Büyük"), fe2: at("demire"), but: at("Ama"), noEnergy: at("vermez."), out: at("söner."),
    second: at("Bir", 1), core: at("çekirdek"), collapse: at("çöker"), blast: at("patlar."), bright: at("Bu"), galaxy: at("galaksiden"), brighter: at("parlak"),
    scatter: at("Ve"), space: at("uzaya"), ago: at("Dört"), sun: at("Güneş"), earth: at("Dünya", 1), blood: at("Kanındaki"), breath: at("nefesindeki"),
    cells: at("hücrelerindeki"), all: at("hepsi"), you: at("Yani", 1), dust: at("tozusun."), now: at("Ve", 1), video: at("videoyu"), watch: at("izliyor."), end: last.t1,
  };
};
type Q = ReturnType<typeof cues>;

const bob = (t: number, seed: number, amp = 10) => Math.sin(t * 1.3 + seed * 2.4) * amp;

// ---------- the characters: all flat tones, no outlines ----------

// you: a round head and a bust, head centre at (x, y). ghost 1: only a dark shape (you don't exist yet).
const Person: React.FC<{ id: string; x: number; y: number; s?: number; lookX?: number; lookY?: number; lid?: number; ghost?: number }> = ({ id, x, y, s = 1, lookX = 0, lookY = 0, lid = 0, ghost = 0 }) => {
  const c = (hex: string) => mix(hex, "#1B1466", ghost);
  const shirt = c("#1B4FE0"), shirtDk = c("#13269C"), skin = c(G.skin), skinDk = c("#EE9570"), hair = c("#FF6A2B"), hairDk = c("#C93A1E");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <clipPath id={`${id}body`}><path d="M-250 1300V410C-250 270 -130 205 0 205S250 270 250 410V1300Z" /></clipPath>
      <clipPath id={`${id}head`}><ellipse rx={168} ry={178} /></clipPath>
      <g clipPath={`url(#${id}body)`}>
        <rect x={-260} y={190} width={520} height={1120} fill={shirt} />
        <path d="M130 190C70 420 120 700 60 1310H270V190Z" fill={shirtDk} />
        <path d="M-170 560C-178 800 -160 1000 -176 1310H-250V520Z" fill={shirtDk} opacity={.55} />
        <ellipse cx={0} cy={205} rx={100} ry={48} fill={shirtDk} />
      </g>
      <rect x={-58} y={120} width={116} height={100} rx={40} fill={skinDk} />
      <circle cx={-168} cy={16} r={36} fill={skin} /><circle cx={168} cy={16} r={36} fill={skinDk} />
      <ellipse rx={168} ry={178} fill={skin} />
      <g clipPath={`url(#${id}head)`}><path d="M60 -190C150 -90 150 90 40 190H190V-190Z" fill={skinDk} /></g>
      <path d="M-176 -6C-196 -150 -96 -214 18 -208C136 -206 198 -124 176 0C160 -70 118 -102 66 -116C8 -88 -86 -88 -128 -96C-152 -76 -164 -44 -176 -6Z" fill={hair} />
      <path d="M66 -116C118 -102 160 -70 176 0C198 -124 136 -206 18 -208C76 -180 92 -150 66 -116Z" fill={hairDk} />
      <path d="M-120 -130C-90 -170 -40 -186 10 -184C-30 -166 -70 -146 -96 -112Z" fill={c("#FF9A5C")} />
      {ghost < .9 && (
        <g opacity={1 - ghost}>
          <ellipse cx={-96} cy={82} rx={30} ry={18} fill="#FF8FA0" opacity={.55} /><ellipse cx={96} cy={82} rx={30} ry={18} fill="#FF8FA0" opacity={.55} />
          <Eyes id={`${id}eye`} x={0} y={18} gap={70} r={46} lookX={lookX} lookY={lookY} lid={lid} />
          <path d="M-30 100Q0 128 30 100Q0 112 -30 100Z" fill="#A42C3C" />
        </g>
      )}
    </g>
  );
};

// an element: a little round creature carrying its symbol
const Atom: React.FC<{ id: string; x: number; y: number; r: number; color: string; sym: string; s?: number; t: number; seed?: number; face?: boolean }> = ({ id, x, y, r, color, sym, s = 1, t, seed = 0, face = true }) => (
  <Ball id={id} x={x} y={y + bob(t, seed, r * .08)} r={r} color={color} s={s}>
    {face && <Eyes id={`${id}e`} x={0} y={-r * .28} gap={r * .34} r={r * .27} lookX={Math.sin(t * .9 + seed)} lookY={Math.cos(t * .7 + seed) * .5} />}
    <Tag x={0} y={face ? r * .36 : 0} size={r * (face ? .62 : .9)} color="#0E0A3C" raw>{sym}</Tag>
  </Ball>
);

// a small atom and its electrons, circling
const Orbit: React.FC<{ x: number; y: number; r: number; t: number; color: string; seed: number; a?: number }> = ({ x, y, r, t, color, seed, a = 1 }) => {
  const k = t * 2.2 + seed * 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${seed * 50})`} opacity={a}>
      <ellipse rx={r} ry={r * .42} fill="none" stroke={color} strokeWidth={3} opacity={.5} />
      <circle r={r * .24} fill={color} />
      <circle cx={Math.cos(k) * r} cy={Math.sin(k) * r * .42} r={r * .11} fill={G.white} />
    </g>
  );
};

// a burning star seen whole: soft light, then flat wavy bands from orange to pale yellow. dim 1: burnt out.
const Star: React.FC<{ id: string; x: number; y: number; r: number; t: number; dim?: number; rays?: number }> = ({ id, x, y, r, t, dim = 0, rays = 0 }) => {
  const c = (hex: string) => mix(hex, "#1C1650", dim);
  return (
    <g transform={`translate(${x} ${y})`}>
      <Glow id={`${id}g`} x={0} y={0} r={r * 3} color={c(G.orange)} a={1 - dim} />
      {rays > 0 && <path d={spikePath(r * 1.1, r * 1.1 + r * .9 * rays, 18, 3)} fill={c(G.yellow)} opacity={.35} transform={`rotate(${t * 9})`} />}
      <path d={blobPath(r * 1.14, { lobes: 9, amp: .03, phase: t * 1.6 })} fill={c("#FF4A1A")} />
      <path d={blobPath(r * 1.04, { lobes: 11, amp: .025, phase: -t * 1.9, seed: 2 })} fill={c(G.orange)} />
      <path d={blobPath(r * .9, { lobes: 7, amp: .035, phase: t * 1.4, seed: 4 })} fill={c(G.yellow)} />
      <path d={blobPath(r * .58, { lobes: 6, amp: .05, phase: -t * 1.1, seed: 6 })} fill={c("#FFF0A0")} />
      {Array.from({ length: 26 }, (_, i) => {
        const a = hash(i * 1.3) * 6.283 + t * .05, rr = r * (.2 + .78 * Math.sqrt(hash(i * 2.9))), w = r * (.018 + .05 * hash(i * 4.1));
        return <ellipse key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} rx={w * 1.7} ry={w} transform={`rotate(${a * 57.3 + 90} ${Math.cos(a) * rr} ${Math.sin(a) * rr})`} fill={c(rr < r * .58 ? G.yellow : rr < r * .9 ? "#FF6A10" : "#FF4A1A")} opacity={.5 + .5 * Math.sin(t * 2 + i)} />;
      })}
    </g>
  );
};

// the star cut open: flat wavy layers, each element in its own band. k: how many layers are lit yet (0..3)
const LAYERS: [number, string, string][] = [[1, "#FFC400", "H"], [.74, "#FF7A00", "He"], [.5, "#F808B8", "C · O"], [.26, "#5C6BE0", "Fe"]];
const Cutaway: React.FC<{ id: string; x: number; y: number; r: number; t: number; shown: number[]; dim?: number }> = ({ id, x, y, r, t, shown, dim = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Glow id={`${id}g`} x={0} y={0} r={r * 2.2} color={mix(G.red, "#1C1650", dim)} a={.8 * (1 - dim)} />
    <path d={blobPath(r * 1.08, { lobes: 9, amp: .025, phase: t * 1.6 })} fill={mix("#FF4A1A", "#1C1650", dim)} />
    {LAYERS.map(([k, col, sym], i) => {
      const s = shown[i] ?? 0, rr = r * k;
      if (s <= 0) return null;
      // the core stays bright red as the rest of the star goes out
      const fill = mix(col, i === 3 ? "#8A1020" : "#1C1650", dim);
      return (
        <g key={sym}>
          <path d={blobPath(rr * Math.max(.01, s), { lobes: 8 + i, amp: .022, phase: t * (i % 2 ? -1.2 : 1.2), seed: i * 2 })} fill={fill} />
          {s > .9 && Array.from({ length: 16 }, (_, j) => {
            const inner = i < 3 ? r * LAYERS[i + 1][0] : 0, a = hash(j * 1.9 + i * 7) * 6.283 + t * .08 * (i % 2 ? -1 : 1), q = inner + (rr - inner) * (.18 + .64 * hash(j * 3.7 + i));
            return <circle key={j} cx={Math.cos(a) * q} cy={Math.sin(a) * q} r={r * (.008 + .016 * hash(j * 5.1 + i))} fill={mix(col, "#FFFFFF", .45)} opacity={(1 - dim) * (.45 + .45 * Math.sin(t * 2.5 + j))} />;
          })}
          <Tag x={0} y={i === 3 ? 0 : -(rr + r * (LAYERS[i + 1][0])) / 2} size={r * (i === 3 ? .16 : .11)} s={s} color={i >= 2 ? G.white : mix("#3A0A10", "#6A5AE0", dim)} a={1 - dim * .3} raw>{sym}</Tag>
        </g>
      );
    })}
  </g>
);

const Earth: React.FC<{ id: string; x: number; y: number; r: number; t: number; s?: number }> = ({ id, x, y, r, t, s = 1 }) => {
  const land: [number, number, number, number][] = [[-.5, -.2, .42, 1], [.25, .25, .36, 2], [.75, -.42, .26, 3], [-.15, .62, .24, 4]];
  const spin = (t * .06) % 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`}>
      <Glow id={`${id}g`} x={0} y={0} r={r * 1.7} color={G.cyan} a={.8} />
      <Ball id={id} x={0} y={0} r={r} color="#1A7BFF" shade="#0F2FA8" light="#2E96FF">
        <g clipPath={`url(#${id})`}>
          {land.map(([lx, ly, lr, seed]) => {
            const px = ((lx + spin + 1.4) % 2.8 - 1.4) * r;
            return <path key={seed} transform={`translate(${px} ${ly * r})`} d={blobPath(lr * r, { lobes: 3, amp: .22, seed, n: 24 })} fill={G.green} />;
          })}
          {[[-.2, -.55, .3], [.45, -.05, .24], [-.55, .35, .22]].map(([cx, cy, cr], i) => (
            <ellipse key={i} cx={(((cx + spin * 1.3 + 1.4) % 2.8) - 1.4) * r} cy={cy * r} rx={cr * r} ry={cr * r * .3} fill={G.white} opacity={.9} />
          ))}
          <path d={`M${r * .4} ${-r * 1.1}C${r * 1.1} ${-r * .4} ${r * .9} ${r * .7} ${-r * .2} ${r * 1.1}H${r * 1.2}V${-r * 1.1}Z`} fill={G.shadow} opacity={.35} />
        </g>
      </Ball>
    </g>
  );
};

// the dust that flies out of everything, and comes back
const Motes: React.FC<{ n: number; cx: number; cy: number; r0: number; r1: number; k: number; spin?: number; size?: number; colors?: string[]; seed?: number; a?: number }> = ({ n, cx, cy, r0, r1, k, spin = 0, size = 5, colors = [G.white, G.cyan, G.magenta, G.yellow], seed = 0, a = 1 }) => (
  <g opacity={a}>
    {Array.from({ length: n }, (_, i) => {
      const h = (j: number) => hash(i * 2.13 + seed + j), ang = h(1) * 6.283 + spin * (1 + h(2)), rr = lerp(r0, r1, k) * (.25 + .85 * h(3));
      return <circle key={i} cx={cx + Math.cos(ang) * rr} cy={cy + Math.sin(ang) * rr} r={size * (.5 + h(4))} fill={colors[i % colors.length]} />;
    })}
  </g>
);

// ---------- the shots ----------
type Shot = (t: number, Q: Q) => React.ReactNode;

const shotHook: Shot = (t, Q) => {
  const z = lerp(1, 1.07, ease(seg(t, 0, Q.bang))), s = pop(t, .05, .5);
  return (
    <AbsoluteFill>
      <Sky color={G.indigo} glow={G.blue} y={900} r={850} a={.6} />
      <Layer x={540} y={900} zoom={z} depth={.3}><Stars t={t} /></Layer>
      <Layer x={540} y={900} zoom={z}>
        <Person id="hk" x={540} y={950} s={s} lookX={Math.sin(t * 1.4) * .8} lookY={-.2} lid={t > 2.2 && t < 2.32 ? 1 : .1} />
        {Array.from({ length: 7 }, (_, i) => {
          const a = i / 7 * 6.283 + t * .45, R = 400 + 40 * Math.sin(i * 2.1);
          return <Orbit key={i} x={540 + Math.cos(a) * R} y={880 + Math.sin(a) * R * .72} r={62 + (i % 3) * 18} t={t} color={[G.cyan, G.magenta, G.yellow][i % 3]} seed={i} a={pop(t, .4 + i * .12)} />;
        })}
      </Layer>
      <Title t={t} at={Q.older} y={340} size={92}>Dünya'dan daha yaşlı</Title>
    </AbsoluteFill>
  );
};

const shotBang: Shot = (t, Q) => {
  // the first flash, its ring running out · hydrogen, helium, and only those drifting in the dark
  const k = easeOut(seg(t, Q.bang, Q.bang + 2.4)), z = lerp(1.25, 1, k), flash = 1 - seg(t, Q.bang, Q.bang + .5);
  return (
    <AbsoluteFill>
      <Sky color={G.violet} glow={G.purple} y={860} r={lerp(200, 1100, k)} a={.7} />
      <Layer x={540} y={860} zoom={z}>
        <circle cx={540} cy={860} r={lerp(30, 1500, k)} fill="none" stroke={G.cyan} strokeWidth={lerp(90, 4, k)} opacity={1 - k} />
        <circle cx={540} cy={860} r={lerp(10, 1100, k)} fill="none" stroke={G.magenta} strokeWidth={lerp(60, 2, k)} opacity={1 - k} />
        <Motes n={220} cx={540} cy={860} r0={10} r1={1050} k={k} spin={t * .02} size={6} colors={[G.white, "#9FD0FF", "#FFE27A"]} />
        <Atom id="ah" x={320} y={760} r={150} color="#3FA8FF" sym="H" t={t} seed={1} s={pop(t, Q.h, .5)} />
        <Tag x={320} y={960} size={50} s={pop(t, Q.h + .1)}>hidrojen</Tag>
        <Atom id="ahe" x={750} y={940} r={185} color={G.yellow} sym="He" t={t} seed={2} s={pop(t, Q.he, .5)} />
        <Tag x={750} y={1180} size={50} s={pop(t, Q.he + .1)}>helyum</Tag>
      </Layer>
      <Title t={t} at={Q.two} y={340} size={96}>Sadece iki element</Title>
      <Fill color={G.white} a={flash} />
    </AbsoluteFill>
  );
};

const shotNothing: Shot = (t, Q) => {
  // three empty places where the elements will be, and an empty place for you
  const slots: [number, string, string, number][] = [[230, "C", "karbon", Q.c], [540, "O", "oksijen", Q.o], [850, "Fe", "demir", Q.fe]];
  return (
    <AbsoluteFill>
      <Sky color={G.violet} glow={G.purple} y={600} r={800} a={.28} />
      <Layer x={540} y={900} zoom={1 + (t - Q.c) * .012} depth={.3}><Stars t={t} n={90} a={.6} seed={2} /></Layer>
      <Cam x={540} y={900} zoom={1 + (t - Q.c) * .012}>
        <World>
          {slots.map(([x, sym, name, at], i) => {
            const s = pop(t, at), cross = ease(seg(t, at + .25, at + .5));
            return (
              <g key={sym} transform={`translate(${x} ${500 + bob(t, i, 6)}) scale(${Math.max(0, s)})`}>
                <circle r={115} fill="#1B1466" />
                <circle r={115} fill="none" stroke="#6A5AE0" strokeWidth={7} strokeDasharray="20 18" transform={`rotate(${t * 18})`} />
                <Tag x={0} y={0} size={84} color="#6A5AE0" raw>{sym}</Tag>
                <Tag x={0} y={160} size={34} color="#A99CFF">{name}</Tag>
                <path d="M-74 -74L74 74M74 -74L-74 74" stroke={G.red} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={`${cross} 1`} />
              </g>
            );
          })}
          <Person id="no" x={540} y={1060} s={pop(t, Q.noYou, .5) * .95} ghost={1} />
        </World>
      </Cam>
      <Title t={t} at={Q.noYou} y={830} size={86} color={G.red}>Sen yoksun</Title>
    </AbsoluteFill>
  );
};

const shotGather: Shot = (t, Q) => {
  // the gas drawn in on a spiral, the arrows pushing; the ball tightens, heats, and lights
  const k = ease(seg(t, Q.gather, Q.lit)), lit = seg(t, Q.lit, Q.lit + .35), grow = easeOut(seg(t, Q.squeeze - .6, Q.lit));
  const z = lerp(1, 1.14, seg(t, Q.gather, Q.star));
  return (
    <AbsoluteFill>
      <Sky color={G.night} glow={lit > 0 ? G.orange : G.purple} y={860} r={lerp(800, 1000, lit)} a={lerp(.4, .75, lit)} />
      <Layer x={540} y={860} zoom={z} depth={.3}><Stars t={t} seed={3} /></Layer>
      <Layer x={540} y={860} zoom={z}>
        <Motes n={260} cx={540} cy={860} r0={1000} r1={70} k={k} spin={k * 2.2} size={7} colors={["#8FC8FF", "#FFE27A", "#C9A0FF"]} a={1 - lit * .7} />
        {lit <= 0 && <Ball id="gas" x={540} y={860} r={lerp(20, 165, grow)} color={mix("#5A3FD0", G.orange, seg(t, Q.squeeze, Q.lit))} />}
        {lit > 0 && <Star id="born" x={540} y={860} r={lerp(165, 250, easeOut(lit))} t={t} rays={lit} />}
        {[45, 135, 225, 315].map((rot) => {
          const R = lerp(600, 300, k), a = rot * Math.PI / 180;
          return <Arrow key={rot} x={540 - Math.cos(a) * R} y={860 - Math.sin(a) * R} rot={rot} size={72} s={pop(t, Q.gather + .2) * (1 - lit)} />;
        })}
      </Layer>
      <Title t={t} at={Q.gather + .1} until={Q.lit} y={340} size={80}>Kütleçekimi</Title>
      <Title t={t} at={Q.lit} y={340} size={92} color={G.yellow}>İlk yıldızlar</Title>
      <Fill color="#FFF4C8" a={.8 * (1 - seg(t, Q.lit, Q.lit + .3)) * (t >= Q.lit ? 1 : 0)} />
    </AbsoluteFill>
  );
};

const SYMBOLS = (t: number, Q: Q) => [
  [Q.h2, Q.he2, "H → He"],
  [Q.he2, Q.big, "He → C + O"],
  [Q.big, Q.but, "… → Fe"],
] as [number, number, string][];

const shotFurnace: Shot = (t, Q) => {
  // the whole star, the oven · cut open · each layer fills in as it's named, the fuel falling in toward the core
  const open = seg(t, Q.h2 - .45, Q.h2 - .05), z = lerp(1, 1.1, seg(t, Q.star, Q.but));
  return (
    <AbsoluteFill>
      <Sky color={G.ember} glow="#E01E46" y={880} r={900} a={.6} />
      <Layer x={540} y={880} zoom={z} depth={.3}><Stars t={t} seed={4} n={80} colors={["#FFD9A0", "#FFFFFF", "#FF9A70"]} /></Layer>
      <Layer x={540} y={880} zoom={z}>
        {open < 1
          ? <g transform={`translate(540 880) scale(${1 - open}) translate(-540 -880)`}><Star id="whole" x={540} y={880} r={400} t={t} /></g>
          : null}
        {open > 0 && (
          <g transform={`translate(540 880) scale(${open}) translate(-540 -880)`}>
            <Cutaway id="cut" x={540} y={880} r={430} t={t} shown={[1, pop(t, Q.h2 + .3), pop(t, Q.c2), pop(t, Q.fe2)]} />
          </g>
        )}
        {t > Q.h2 && <Motes n={70} cx={540} cy={880} r0={520} r1={90} k={((t * .35) % 1)} spin={t * .3} size={6} colors={[G.white, "#FFF0A0"]} a={.8} />}
      </Layer>
      <Title t={t} at={Q.oven} until={Q.h2} y={325} size={84} color={G.white}>Dev bir fırın</Title>
      {SYMBOLS(t, Q).map(([a, b, s]) => <Title key={s} t={t} at={a} until={b} y={300} size={94} raw>{s}</Title>)}
    </AbsoluteFill>
  );
};

const Gauge: React.FC<{ x: number; y: number; r: number; v: number; s?: number }> = ({ x, y, r, v, s = 1 }) => {
  const a = lerp(180, 360, v) * Math.PI / 180;
  const arc = (a0: number, a1: number) => `M${Math.cos(a0) * r} ${Math.sin(a0) * r}A${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`;
  const seg3: [number, number, string][] = [[180, 240, G.red], [240, 300, G.yellow], [300, 360, G.mint]];
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`}>
      {seg3.map(([a0, a1, c]) => <path key={c} d={arc(a0 * Math.PI / 180 + .03, a1 * Math.PI / 180 - .03)} fill="none" stroke={c} strokeWidth={r * .2} />)}
      <path d={`M0 ${-r * .07}L${Math.cos(a) * r * .9} ${Math.sin(a) * r * .9}L0 ${r * .07}Z`} fill={G.white} transform={`rotate(0)`} />
      <circle r={r * .1} fill={G.white} />
      <Tag x={0} y={r * .32} size={r * .2}>enerji</Tag>
    </g>
  );
};

const shotDying: Shot = (t, Q) => {
  const fall = ease(seg(t, Q.noEnergy - .3, Q.out + .2)), dim = ease(seg(t, Q.noEnergy, Q.out + .5));
  const wob = (1 - fall) * Math.sin(t * 7) * .02;
  return (
    <AbsoluteFill>
      <Sky color={mix(G.ember, G.night, dim)} glow={mix("#E01E46", "#301060", dim)} y={1030} r={900} a={lerp(.6, .3, dim)} />
      <Layer x={540} y={950} zoom={1.02} depth={.3}><Stars t={t} seed={4} n={80} /></Layer>
      <Layer x={540} y={950} zoom={1.02}>
        <Cutaway id="die" x={540} y={1040} r={330} t={t} shown={[1, 1, 1, 1]} dim={dim} />
        <Gauge x={540} y={590} r={185} v={lerp(.85 + wob, .02, fall)} s={pop(t, Q.but + .05)} />
      </Layer>
      <Title t={t} at={Q.out} y={265} size={84} color={G.red}>Fırın söndü</Title>
    </AbsoluteFill>
  );
};

const shotBoom: Shot = (t, Q) => {
  // holding its breath, shaking · falling in on itself · then everything at once
  if (t < Q.blast) {
    const fall = easeIn(seg(t, Q.collapse, Q.blast)), r = lerp(350, 8, fall), [sx, sy] = shake(t, lerp(1, 16, seg(t, Q.core, Q.blast)));
    return (
      <AbsoluteFill>
        <Sky color={G.night} glow="#301060" y={960} r={700} a={.25 + fall * .5} />
        <Cam x={540 + sx} y={960 + sy} zoom={1}>
          <World>
            <Stars t={t} seed={4} n={80} a={.6} />
            <Cutaway id="col" x={540} y={960} r={r} t={t * 3} shown={[1, 1, 1, 1]} dim={1} />
            {fall > 0 && <circle cx={540} cy={960} r={lerp(600, 0, fall)} fill="none" stroke={G.white} strokeWidth={6} opacity={fall} />}
          </World>
        </Cam>
        <Title t={t} at={Q.second} y={320} size={108} color={G.white}>Bir saniyeden kısa</Title>
      </AbsoluteFill>
    );
  }
  const k = easeOut(seg(t, Q.blast, Q.blast + 1.1)), [sx, sy] = shake(t, 34 * (1 - seg(t, Q.blast, Q.blast + .9))), R = lerp(40, 1250, k);
  return (
    <AbsoluteFill>
      <Sky color={G.ember} glow="#E01E46" y={960} r={1200} a={.9} />
      <Cam x={540 + sx} y={960 + sy} zoom={1}>
        <World>
          <g transform={`translate(540 960) rotate(${t * 14})`}>
            <path d={spikePath(R * .62, R * 1.12, 22, 1)} fill={G.red} />
            <path d={spikePath(R * .5, R * .92, 18, 5)} fill={G.orange} transform="rotate(12)" />
            <path d={spikePath(R * .36, R * .68, 16, 9)} fill={G.yellow} transform="rotate(-9)" />
            <path d={spikePath(R * .2, R * .42, 12, 14)} fill={G.white} />
          </g>
          <Motes n={200} cx={540} cy={960} r0={20} r1={1500} k={easeOut(seg(t, Q.blast, Q.blast + 2))} spin={.1} size={9} colors={[G.white, G.yellow, G.cyan, G.magenta]} />
        </World>
      </Cam>
      <Fill color={G.white} a={1 - seg(t, Q.blast, Q.blast + .28)} />
    </AbsoluteFill>
  );
};

const GX = 540, GY = 800;
const Galaxy: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`translate(${GX} ${GY}) rotate(-24) scale(1 .62)`}>
    <Glow id="disc" x={0} y={0} r={640} color={G.purple} a={.75} />
    <Glow id="core" x={0} y={0} r={360} color="#FFD0F0" a={.95} />
    <g transform={`rotate(${t * 2.5})`}>
      {Array.from({ length: 620 }, (_, i) => {
        const u = Math.pow(hash(i * 1.71), .75), arm = i % 2, th = u * 7 + arm * Math.PI + (hash(i * 3.3) - .5) * .7, rr = 26 + u * 450;
        const col = [G.white, "#9FD0FF", "#FFB0E6", "#FFE27A"][i % 4];
        return <circle key={i} cx={Math.cos(th) * rr} cy={Math.sin(th) * rr} r={2.4 + hash(i * 5.3) * 4.6} fill={col} opacity={.65 + .35 * hash(i * 7.7)} />;
      })}
    </g>
    <circle r={58} fill="#FFF3D8" />
  </g>
);

const shotGalaxy: Shot = (t, Q) => {
  // one star on the rim of a whole galaxy, and it outshines all of it
  const flare = easeOut(seg(t, Q.galaxy, Q.brighter + .5)), px = GX + 300, py = GY - 170, z = lerp(1.05, 1, seg(t, Q.bright, Q.scatter));
  return (
    <AbsoluteFill>
      <Sky color={G.night} glow={G.purple} y={GY} r={900} a={lerp(.45, .25, flare)} />
      <Layer x={540} y={GY} zoom={z} depth={.3}><Stars t={t} seed={5} /></Layer>
      <Layer x={540} y={GY} zoom={z}>
        <g opacity={lerp(1, .55, flare)}><Galaxy t={t} /></g>
        <Glow id="nova" x={px} y={py} r={lerp(90, 620, flare)} color={G.white} />
        <Glow id="nova2" x={px} y={py} r={lerp(60, 400, flare)} color={G.yellow} />
        <Sparkle x={px} y={py} r={lerp(46, 215, flare)} rot={t * 6} />
        <Tag x={GX - 90} y={GY + 400} size={44} s={pop(t, Q.bright + .2)} color="#C9A0FF">milyarlarca yıldız</Tag>
        <g transform={`translate(0 ${bob(t, 3, 8)})`}>
          <Arrow x={px} y={py + 90 + 240 * flare * .4} rot={270} size={60} color={G.red} s={pop(t, Q.bright)} />
          <Tag x={px} y={py + 90 + 240 * flare * .4 + 165} size={44} s={pop(t, Q.bright)}>1 yıldız</Tag>
        </g>
      </Layer>
      <Title t={t} at={Q.brighter} y={320} size={92}>Galaksiden parlak</Title>
    </AbsoluteFill>
  );
};

const Nebula: React.FC<{ t: number; x: number; y: number; k: number; a?: number }> = ({ t, x, y, k, a = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={a}>
    {[[0, 0, 640, "#3A1CC0", 0, .95], [-190, -230, 400, "#7A2BF5", 2, .9], [240, 180, 430, "#B018C8", 4, .9], [-160, 320, 320, G.blue, 6, .8], [210, -300, 290, G.magenta, 8, .85], [0, 40, 300, "#FF5AAF", 10, .75], [-20, 40, 150, "#FFD0E6", 12, .8]].map(([bx, by, r, c, seed, op], i) => (
      <path key={i} transform={`translate(${bx} ${by})`} d={blobPath(r as number, { lobes: 4, amp: .14, phase: t * .22 * (i % 2 ? 1 : -1), seed: seed as number })} fill={c as string} opacity={op as number} />
    ))}
  </g>
);

const SCATTER: [string, string, number, number][] = [["C", "#2FD36B", -.9, 0], ["O", G.cyan, .15, .25], ["Fe", "#AAB4FF", 2.5, .5], ["N", "#FFB0E6", -2.2, .75], ["Ca", G.yellow, .95, .95], ["Si", "#FF8A5C", 3.5, 1.15]];
const shotScatter: Shot = (t, Q) => {
  const k = seg(t, Q.scatter, Q.ago), z = lerp(1, 1.12, k);
  return (
    <AbsoluteFill>
      <Sky color={G.night} glow={G.magenta} y={900} r={1000} a={.35} />
      <Layer x={540} y={900} zoom={z} depth={.25}><Stars t={t} seed={6} /></Layer>
      <Layer x={540} y={900} zoom={z} depth={.6}><Nebula t={t} x={540} y={900} k={lerp(.5, 1.1, easeOut(k))} /></Layer>
      <Layer x={540} y={900} zoom={z}>
        <Motes n={150} cx={540} cy={900} r0={60} r1={900} k={easeOut(k)} spin={k * .5} size={7} />
        {SCATTER.map(([sym, col, dir, dl], i) => {
          const u = easeOut(seg(t, Q.scatter + dl * .9, Q.scatter + dl * .9 + 1.8)), d = u * (330 + i * 18);
          return <Atom key={sym} id={`sc${i}`} x={540 + Math.cos(dir) * d} y={880 + Math.sin(dir) * d} r={lerp(26, 104, u)} color={col} sym={sym} t={t} seed={i} s={pop(t, Q.scatter + dl * .9)} />;
        })}
      </Layer>
      <Title t={t} at={Q.space} y={300} size={92}>Uzaya saçılıyor</Title>
    </AbsoluteFill>
  );
};

const shotBirth: Shot = (t, Q) => {
  // the cloud falls together; the Sun at the top, the Earth pops onto its orbit below
  const k = ease(seg(t, Q.ago, Q.sun)), z = lerp(1.02, 1.08, seg(t, Q.ago, Q.blood));
  return (
    <AbsoluteFill>
      <Sky color={G.night} glow={G.blue} y={850} r={950} a={.32} />
      <Layer x={540} y={900} zoom={z} depth={.3}><Stars t={t} seed={7} /></Layer>
      <Layer x={540} y={900} zoom={z}>
        <Nebula t={t} x={540} y={760} k={lerp(1.05, .1, k)} a={1 - seg(t, Q.sun - .2, Q.sun + .35)} />
        <Motes n={130} cx={540} cy={760} r0={760} r1={250} k={k} spin={k * 1.8 + t * .1} size={5} a={.8} />
        <ellipse cx={540} cy={760} rx={445} ry={385} fill="none" stroke={G.white} strokeWidth={4} strokeDasharray="4 22" strokeLinecap="round" opacity={.6 * seg(t, Q.earth - .1, Q.earth + .4)} />
        <g transform={`translate(540 760) scale(${pop(t, Q.sun, .5)}) translate(-540 -760)`}><Star id="sun" x={540} y={760} r={185} t={t} /></g>
        <Earth id="erd" x={540} y={1145} r={118} t={t} s={pop(t, Q.earth, .5)} />
        <Tag x={540} y={500} size={40} s={pop(t, Q.sun + .1)}>güneş</Tag>
        <Tag x={800} y={1145} size={40} s={pop(t, Q.earth + .1)}>dünya</Tag>
      </Layer>
      <Title t={t} at={Q.ago} y={310} size={88}>4,5 milyar yıl önce</Title>
    </AbsoluteFill>
  );
};

const Drop: React.FC<{ size: number }> = ({ size }) => (
  <g transform={`scale(${size})`}>
    <path d="M0 -100C50 -40 72 -6 72 26C72 66 40 96 0 96S-72 66 -72 26C-72 -6 -50 -40 0 -100Z" fill={G.red} />
    <path d="M26 -40C50 -8 72 2 72 26C72 66 40 96 0 96C20 80 44 60 44 26C44 2 38 -18 26 -40Z" fill="#A5102C" />
    <ellipse cx={-30} cy={22} rx={13} ry={25} fill="#FF8A96" transform="rotate(14 -30 22)" />
  </g>
);
const Bubbles: React.FC<{ size: number; t: number }> = ({ size, t }) => (
  <g transform={`scale(${size})`}>
    {[[-30, 24, 62], [36, -18, 50], [40, 58, 30], [-24, -66, 28]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y + bob(t, i, 6)})`}><circle r={r} fill={G.cyan} opacity={.9} /><circle cx={r * .25} cy={r * .25} r={r * .7} fill="#14A9C0" /><circle cx={-r * .35} cy={-r * .35} r={r * .22} fill={G.white} /></g>
    ))}
  </g>
);
const Cell: React.FC<{ size: number; t: number }> = ({ size, t }) => (
  <g transform={`scale(${size})`}>
    <path d={blobPath(92, { lobes: 4, amp: .07, phase: t * .9, seed: 1 })} fill={G.green} />
    <path d={blobPath(70, { lobes: 4, amp: .07, phase: -t * .7, seed: 3 })} fill="#7DF0A6" />
    <circle cx={8} cy={-6} r={32} fill="#0E8A5C" /><circle cx={-2} cy={-16} r={10} fill="#7DF0A6" />
    {[[-44, 28], [40, 42], [-36, -38]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#0E8A5C" />)}
  </g>
);

const shotBody: Shot = (t, Q) => {
  // iron, oxygen, carbon pop up around you, then all three fly back up into a star
  const home = ease(seg(t, Q.all + .4, Q.you - .1)), sx = 540, sy = 500, sPop = pop(t, Q.all, .5);
  const items: [number, number, number, string, string, React.ReactNode][] = [
    [190, 620, Q.blood, "Fe", "demir", <Drop key="d" size={.9} />],
    [540, 470, Q.breath, "O", "oksijen", <Bubbles key="b" size={.9} t={t} />],
    [890, 620, Q.cells, "C", "karbon", <Cell key="c" size={.95} t={t} />],
  ];
  return (
    <AbsoluteFill>
      <Sky color={G.indigo} glow={G.blue} y={1000} r={900} a={.55} />
      <Layer x={540} y={950} zoom={1} depth={.3}><Stars t={t} seed={8} /></Layer>
      <Layer x={540} y={950} zoom={1 + (t - Q.blood) * .006}>
        <Person id="bd" x={540} y={1060} s={.96} lookX={home > 0 ? 0 : Math.sin(t * 1.1) * .9} lookY={-.8} />
        {sPop > 0 && <g transform={`translate(${sx} ${sy}) scale(${sPop}) translate(${-sx} ${-sy})`}><Star id="bs" x={sx} y={sy} r={100} t={t} rays={.4} /></g>}
        {items.map(([x, y, at, sym, name, icon], i) => {
          const px = lerp(x, sx, home), py = lerp(y, sy, home) + bob(t, i, 8), s = pop(t, at, .45) * lerp(1, .15, home);
          return (
            <g key={sym} transform={`translate(${px} ${py}) scale(${Math.max(0, s)})`}>
              {icon}
              <Tag x={0} y={126} size={38}>{name}</Tag>
            </g>
          );
        })}
      </Layer>
      <Title t={t} at={Q.all} y={305} size={60} color={G.yellow}>Hepsi bir yıldızdan</Title>
    </AbsoluteFill>
  );
};

const shotDust: Shot = (t, Q) => {
  // you, glittering: stardust · the phone comes up, you look down at it · and on the last word, up at the viewer
  const z = lerp(1, 1.1, ease(seg(t, Q.you, Q.end))), phone = easeOut(seg(t, Q.now, Q.now + .6)), up = ease(seg(t, Q.watch, Q.watch + .3));
  const blink = (t > Q.watch + .5 && t < Q.watch + .62) ? 1 : .08;
  return (
    <AbsoluteFill>
      <Sky color={G.indigo} glow={G.purple} y={1000} r={1000} a={.6} />
      <Layer x={540} y={950} zoom={z} depth={.3}><Stars t={t} seed={9} n={200} /></Layer>
      <Layer x={540} y={950} zoom={z}>
        <Motes n={170} cx={540} cy={900} r0={150} r1={620} k={.7 + .3 * Math.sin(t * .4)} spin={t * .18} size={6} colors={[G.white, G.yellow, G.cyan, G.magenta]} a={pop(t, Q.you, .6)} />
        <Person id="ds" x={540} y={880} lookY={lerp(phone * 1, -.05, up)} lookX={0} lid={blink} />
        {Array.from({ length: 24 }, (_, i) => {
          const tw = .5 + .5 * Math.sin(t * (2 + hash(i) * 3) + i), s = seg(t, Q.dust - .15, Q.dust + .3);
          return <Sparkle key={i} x={330 + hash(i * 3.1) * 420} y={1120 + hash(i * 4.7) * 240 - 560 * (i % 3 === 0 ? 1 : 0)} r={(8 + hash(i * 5.9) * 14) * s} color={[G.white, G.yellow, G.cyan][i % 3]} a={tw} rot={t * 20} />;
        })}
        <g transform={`translate(540 ${lerp(2300, 1215, phone)})`}>
          <Glow id="scr" x={0} y={-150} r={380} color="#9FD0FF" a={.5 * phone} />
          <rect x={-115} y={-150} width={230} height={330} rx={34} fill="#10104A" />
          <rect x={-115} y={-150} width={60} height={330} rx={30} fill="#1C1C6A" />
          <circle cx={-60} cy={-92} r={26} fill="#2B2B85" /><circle cx={-60} cy={-92} r={13} fill="#080828" />
          <circle cx={-128} cy={70} r={62} fill={G.skin} /><circle cx={128} cy={70} r={62} fill="#EE9570" />
        </g>
      </Layer>
      <Title t={t} at={Q.dust} y={340} size={100} color={G.yellow}>Yıldız tozu</Title>
    </AbsoluteFill>
  );
};

export const YildizP1: React.FC<{ nar: Narration | null }> = ({ nar }) => {
  const frame = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), t = frame / fps;
  if (!nar) throw new Error("the narration wasn't loaded");
  const Q = useMemo(() => cues(nar), [nar]), DUR = durationInFrames / fps;
  const shots: [number, Shot][] = [[0, shotHook], [Q.bang, shotBang], [Q.c - .1, shotNothing], [Q.gather, shotGather], [Q.star, shotFurnace], [Q.but, shotDying], [Q.second, shotBoom], [Q.bright, shotGalaxy], [Q.scatter, shotScatter], [Q.ago, shotBirth], [Q.blood, shotBody], [Q.you, shotDust]];
  let i = 0; while (i + 1 < shots.length && t >= shots[i + 1][0]) i++;
  const moves = [Q.c - .1, Q.gather, Q.star, Q.but, Q.bright, Q.scatter, Q.ago, Q.blood, Q.you];
  const pops = [Q.h, Q.he, Q.c, Q.o, Q.fe, Q.noYou, Q.h2 + .3, Q.c2, Q.fe2, Q.sun, Q.earth, Q.blood, Q.breath, Q.cells];
  return (
    <AbsoluteFill style={{ backgroundColor: G.night }}>
      {shots[i][1](t, Q)}
      {/* a quick breath of dark at each new shot; the flashes bring their own */}
      <Fill color={G.night} a={i && i !== 1 && i !== 3 && i !== 6 ? 1 - seg(t, shots[i][0], shots[i][0] + .16) : 0} />
      <div style={{ position: "absolute", left: 60, top: 235, fontFamily: ANTON, fontSize: 34, color: CREAM, opacity: .7 }}>{HANDLE}</div>
      <Captions nar={nar} t={t} plain size={54} maxWords={5} y={1470} />
      <Audio src={staticFile(nar.audio)} />
      <Sfx fps={fps} src="sfx/pad.wav" at={0} dur={DUR} volume={.28} loop fade={[1.5, 1.5]} />
      {moves.map((a) => <Sfx key={a} fps={fps} src="sfx/whoosh.wav" at={a - .3} volume={.3} />)}
      {pops.map((a) => <Sfx key={a} fps={fps} src="sfx/pop.wav" at={a} volume={.4} />)}
      <Sfx fps={fps} src="sfx/shimmer.wav" at={Q.bang + .1} volume={.3} />
      <Sfx fps={fps} src="sfx/shimmer.wav" at={Q.lit} volume={.4} />
      <Sfx fps={fps} src="sfx/riser.wav" at={Q.blast - 3} volume={.5} />
      <Sfx fps={fps} src="sfx/boom.wav" at={Q.blast} volume={.55} />
      <Sfx fps={fps} src="sfx/shimmer.wav" at={Q.dust} volume={.4} />
    </AbsoluteFill>
  );
};

export const story: StoryPart = { id: "yildiz-p1", narration: "yildiz-p1", component: YildizP1 };
