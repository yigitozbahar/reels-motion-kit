// DugmelerP1.tsx: the second example, "Düğmeler": a loop. The red/blue button dilemma, put to the viewer, and the last
// sentence ("Cevap vermeden önce şunu bil:") runs into the first ("Önünde iki düğme var.") when the reel replays, so the
// last frame is the first frame. Every shot is timed to the narration's words (Q below).
//   desk      your desk, two buttons: red (a single figure), blue (a crowd), lit as they're named
//   crowd     out from your window to a wall of 10,000: nobody can see what anyone presses
//   red wins  the votes come in, red passes half: the blue windows go dark, the counter falls
//   blue wins again, blue passes half: nobody dies
//   choice    back at the desk: red saves you, blue saves everyone (if enough press it), your hand hovering · and back
import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { BigButton } from "../../library/props/BigButton";
import { PovHand } from "../../library/props/PovHand";
import { Desk } from "../../library/sets/Desk";
import { WindowGrid } from "../../library/sets/WindowGrid";
import { Captions } from "../../library/ui/Captions";
import { Counter } from "../../library/ui/Counter";
import { Cam, Fill, Grain, Vignette, World } from "../../library/ui/Frame";
import { Meter } from "../../library/ui/Meter";
import { ANTON, CREAM, INK } from "../../library/style";
import { clamp, ease, easeIn, easeOut, hash, lerp, seg } from "../../lib/anim";
import { cueAt, Narration } from "../../lib/narration";
import { StoryPart } from "../../lib/story";

const RED = "#E8453C", BLUE = "#3E7BE0", DEAD = "#11131C", DIM = "#6E6A5C";
const N = 100, CELL = 8, GX = 140, GY = 350, YOU = 41 * N + 57;          // 10,000 windows, yours in row 41, column 57
const youAt: [number, number] = [GX + (YOU % N) * CELL + CELL / 2, GY + Math.floor(YOU / N) * CELL + CELL / 2];
const BTN = { red: [345, 1160] as [number, number], blue: [735, 1160] as [number, number], r: 120 };

const cues = (nar: Narration) => {
  const at = (raw: string, n = 0) => cueAt(nar, raw, n), last = nar.words[nar.words.length - 1];
  return {
    red: at("kırmızı,"), blue: at("mavi."), crowd: at("Şu"), hidden: at("Kimin"), redWins: at("Kırmızıya"), dies: at("herkes"),
    blueWins: at("Maviye"), nobody: at("kimse", 1), saveYou: at("Kırmızı", 1), saveAll: at("Mavi", 1), enough: at("tabii"),
    ask: at("Peki"), back: at("Cevap"), end: last.t1 + .12,
  };
};
type Q = ReturnType<typeof cues>;

// every window's colour: hidden (a dim lamp) until its vote comes in at a random moment of the tally, then red or blue;
// shareRed of them press red. dieAt: when the blue windows go dark (red won).
const tally = (t: number, t0: number, shareRed: number, dieAt = Infinity) => (i: number) => {
  if (i === YOU) return CREAM;
  const k = seg(t, t0 + hash(i * 1.37) * 1.6, t0 + hash(i * 1.37) * 1.6 + .05), red = hash(i * 7.31) < shareRed;
  if (k < 1) return DIM;
  if (!red && t > dieAt + hash(i * 3.3) * .9) return DEAD;
  return red ? RED : BLUE;
};
const shares = (t: number, t0: number, shareRed: number) => { const k = clamp((t - t0) / 1.65); return [shareRed * k, (1 - shareRed) * k]; };

type Shot = (t: number, Q: Q) => React.ReactNode;

// ---------- the desk: the opening frame and the closing frame are the same ----------
const desk = (t: number, Q: Q, o: { glowR?: number; glowB?: number; cx?: number; cy?: number; z?: number; hover?: number }) => {
  const { glowR = 0, glowB = 0, cx = 540, cy = 1060, z = 1, hover = 0 } = o;
  const hx = lerp(880, lerp(BTN.red[0] + 70, BTN.blue[0] - 40, .5 + .5 * Math.sin((t - Q.ask) * 2.4)), hover), hy = lerp(1700, 1330, hover);
  return (
    <Cam x={cx} y={cy} zoom={z}>
      <World>
        <Desk>
          <BigButton id="red" x={BTN.red[0]} y={BTN.red[1]} r={BTN.r} color={RED} glow={glowR} icon="one" />
          <BigButton id="blue" x={BTN.blue[0]} y={BTN.blue[1]} r={BTN.r} color={BLUE} glow={glowB} icon="many" />
          <PovHand x={200} y={1720} angle={.35} grip={.2} scale={.95} />
          <PovHand x={hx} y={hy} angle={lerp(-.35, -.1, hover)} grip={lerp(.2, .6, hover)} scale={.95} />
        </Desk>
      </World>
    </Cam>
  );
};

const shotOpen: Shot = (t, Q) => {
  // still for a moment (so the loop's seam is invisible), then a slow push; each button lights as it's named
  const push = ease(seg(t, .6, Q.crowd - .4)), into = easeIn(seg(t, Q.crowd - .45, Q.crowd));
  return (
    <AbsoluteFill>
      {desk(t, Q, { glowR: seg(t, Q.red, Q.red + .3) * (1 - .5 * seg(t, Q.blue, Q.blue + .4)), glowB: seg(t, Q.blue, Q.blue + .3), cy: lerp(1060, 1100, push), z: lerp(1, 1.08, push) + 3 * into })}
      <Fill a={into} color="#232736" />
    </AbsoluteFill>
  );
};

const shotCrowd: Shot = (t, Q) => {
  // out from your window to all 10,000; the counter fades in; every window just a dim lamp: nobody sees anyone's choice
  const out = easeOut(seg(t, Q.crowd, Q.crowd + 1.6)), z = Math.exp(lerp(Math.log(40), Math.log(1), out));
  const cx = lerp(youAt[0], 540, out), cy = lerp(youAt[1], 750, out);
  return (
    <AbsoluteFill style={{ backgroundColor: "#151824" }}>
      <Cam x={cx} y={cy} zoom={z}><World><WindowGrid cols={N} rows={N} x0={GX} y0={GY} cell={CELL} tile={(i) => (i === YOU ? CREAM : hash(i * 5.1 + Math.floor(t * 3)) < .03 ? "#8A8470" : DIM)} you={YOU} youGlow={.5 + .5 * Math.sin(t * 5)} /></World></Cam>
      <Counter label="HAYATTA" value={10000} y={250} a={seg(t, Q.crowd + .8, Q.crowd + 1.3)} />
    </AbsoluteFill>
  );
};

const shotRedWins: Shot = (t, Q) => {
  const share = .62, [a, b] = shares(t, Q.redWins + .2, share), dying = seg(t, Q.dies, Q.dies + 1.2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#151824" }}>
      <Cam x={540} y={750} zoom={1}><World><WindowGrid cols={N} rows={N} x0={GX} y0={GY} cell={CELL} tile={tally(t, Q.redWins + .2, share, Q.dies)} you={YOU} /></World></Cam>
      <Counter label="HAYATTA" value={10000 - Math.round((1 - share) * 10000 * dying)} y={250} alarm={dying > 0 ? 1 : 0} />
      <Meter a={a} b={b} colA={RED} colB={BLUE} y={1215} />
      <Fill color="#3A0A10" a={t > Q.dies ? .25 * (1 - seg(t, Q.dies, Q.dies + .8)) : 0} />
    </AbsoluteFill>
  );
};

const shotBlueWins: Shot = (t, Q) => {
  const share = .42, [a, b] = shares(t, Q.blueWins + .2, share);
  return (
    <AbsoluteFill style={{ backgroundColor: "#151824" }}>
      <Cam x={540} y={750} zoom={1}><World><WindowGrid cols={N} rows={N} x0={GX} y0={GY} cell={CELL} tile={tally(t, Q.blueWins + .2, share)} you={YOU} /></World></Cam>
      <Counter label="HAYATTA" value={10000} y={250} />
      <Meter a={a} b={b} colA={RED} colB={BLUE} y={1215} />
      <Fill a={1 - seg(t, Q.blueWins, Q.blueWins + .25)} color="#151824" />
    </AbsoluteFill>
  );
};

const shotChoice: Shot = (t, Q) => {
  // red, close · blue, close · "if enough press it": the meter hovering at half · your hand hovering · back to the start
  if (t < Q.enough) {
    const onBlue = ease(seg(t, Q.saveAll - .1, Q.saveAll + .5));
    return desk(t, Q, { glowR: 1 - onBlue, glowB: onBlue, cx: lerp(BTN.red[0], BTN.blue[0], onBlue), cy: 1200, z: 1.9 });
  }
  if (t < Q.ask) {
    const wob = .5 + .06 * Math.sin((t - Q.enough) * 5) + .02 * Math.sin((t - Q.enough) * 13);
    return (
      <AbsoluteFill style={{ backgroundColor: "#151824" }}>
        <Meter a={1 - wob} b={wob} colA={RED} colB={BLUE} y={900} w={900} />
        <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 64, color: CREAM, WebkitTextStroke: `7px ${INK}`, paintOrder: "stroke fill" }}>YETERİNCE KİŞİ?</div>
      </AbsoluteFill>
    );
  }
  // the hand comes up and hovers between the two · then settles back, and the frame eases into the opening frame
  const hover = ease(seg(t, Q.ask, Q.ask + .6)) * (1 - ease(seg(t, Q.back + .3, Q.end - .35))), settle = ease(seg(t, Q.back, Q.end - .2));
  return desk(t, Q, { hover, glowR: .35 * hover, glowB: .35 * hover, cy: lerp(1150, 1060, settle), z: lerp(1.15, 1, settle) });
};

// ---------- the sound ----------
const Sfx: React.FC<{ src: string; at: number; volume?: number; fps: number; dur?: number; loop?: boolean }> = ({ src, at, volume = 1, fps, dur, loop }) => (
  <Sequence from={Math.round(at * fps)} durationInFrames={dur ? Math.round(dur * fps) : undefined}>
    <Audio src={staticFile(src)} loop={loop} volume={volume} />
  </Sequence>
);

export const DugmelerP1: React.FC<{ nar: Narration | null }> = ({ nar }) => {
  const frame = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), t = frame / fps;
  if (!nar) throw new Error("the narration wasn't loaded");
  const Q = useMemo(() => cues(nar), [nar]), DUR = durationInFrames / fps;
  const shots: [number, Shot][] = [[0, shotOpen], [Q.crowd, shotCrowd], [Q.redWins, shotRedWins], [Q.blueWins, shotBlueWins], [Q.saveYou, shotChoice]];
  let i = 0; while (i + 1 < shots.length && t >= shots[i + 1][0]) i++;
  return (
    <AbsoluteFill style={{ backgroundColor: "#151824" }}>
      {shots[i][1](t, Q)}
      <Vignette />
      <Grain t={t} />
      {/* the question stays up the whole loop: the comments are the answers */}
      {(t < Q.crowd + .6 || t >= Q.saveYou) && (
        <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 72, lineHeight: 1, color: CREAM, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>
          <span style={{ color: RED }}>KIRMIZI</span> MI, <span style={{ color: BLUE }}>MAVİ</span> Mİ?
        </div>
      )}
      <Captions nar={nar} t={t} />
      <Audio src={staticFile(nar.audio)} />
      <Sfx fps={fps} src="sfx/drone.wav" at={0} dur={DUR} volume={.4} loop />
      <Sfx fps={fps} src="sfx/tick-run.wav" at={Q.redWins + .2} volume={.6} />
      <Sfx fps={fps} src="sfx/stinger.wav" at={Q.dies} volume={.55} />
      <Sfx fps={fps} src="sfx/tick-run.wav" at={Q.blueWins + .2} volume={.6} />
      <Sfx fps={fps} src="sfx/heartbeat.wav" at={Q.ask} dur={DUR - Q.ask} volume={.5} loop />
    </AbsoluteFill>
  );
};

export const story: StoryPart = { id: "dugmeler-p1", narration: "dugmeler-p1", component: DugmelerP1, loop: true };
