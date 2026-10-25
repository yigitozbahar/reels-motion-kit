// ApartmanP1.tsx: the example story, "Apartman" part 1. A POV horror reel, every shot timed to the narration's words
// (Q below). Copy its shape for a new story part in src/stories/.
//   lock      2 a.m., a notification on the lock screen · close on it: the sender died three years ago (a black ribbon)
//   chat      his rule, in the building's group chat · read by eleven
//   building  the block from the street: windows light up as everyone reads it · and go dark: nobody answers
//   rings     the hallway · one, two, three: the chime box, the door, closer · into the peephole
//   peephole  Nermin Teyze, robe and slippers · your spare key in her hand · her grin
//   chat2     a new message: from Nermin Teyze, who says she's at home
//   floor     a paper slides in under the door, past her feet's shadows
//   receipt   a three-year-old dues receipt, his signature · turned over: a note from whoever is at the door
//   lock      the fourth ring · the lock turns by itself
//   choice    A: open the door to her · B: lock it from inside · the card, the call to comment
import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { KemalBey } from "./characters/KemalBey";
import { NerminTeyze } from "./characters/NerminTeyze";
import { Building } from "../../library/sets/Building";
import { FloorUnderDoor } from "../../library/sets/FloorUnderDoor";
import { CHIME, FrontDoor, LOCK, PEEP } from "../../library/sets/FrontDoor";
import { Stairwell } from "../../library/sets/Stairwell";
import { Message, Phone, PHONE_H, PHONE_W } from "../../library/props/Phone";
import { PovHand } from "../../library/props/PovHand";
import { Receipt } from "../../library/props/Receipt";
import { Captions } from "../../library/ui/Captions";
import { ChoiceCard } from "../../library/ui/ChoiceCard";
import { Cam, Fill, Grain, Vignette, World } from "../../library/ui/Frame";
import { Peephole } from "../../library/ui/Peephole";
import { ANTON, CREAM, INK, RED } from "../../library/style";
import { ease, easeIn, easeOut, kf, kicks, lerp, seg, shake } from "../../lib/anim";
import { cueAt, Narration } from "../../lib/narration";
import { StoryPart } from "../../lib/story";

const cues = (nar: Narration) => {
  const at = (raw: string, n = 0) => cueAt(nar, raw, n);
  return {
    msg: at("mesaj"), sender: at("Gönderen,"), dead: at("ölen"), rule: at("“Zil"), seen: at("Mesajı"), nobody: at("kimse"),
    ring0: at("Sonra"), ring1: at("Bir."), ring2: at("İki."), ring3: at("Üç."), peek: at("Kapı"), feet: at("Terlikleri,"),
    key: at("Elinde"), noKey: at("Ama"), smile: at("Sadece"), msg2: at("Gruba"), buzz2: at("düşüyor."), from2: at("Gönderen:"),
    her: at("“Ben"), slide: at("Kapının"), receipt: at("Üç", 1), sign: at("Kemal", 1), back: at("Arkasında"),
    note: at("“Telefonum"), real: at("Kapıdaki"), realN: at("benim.”"), ring4: at("Zil"), ring4t: at("çalıyor.", 1),
    turn0: at("Bu"), turn: at("dönüyor."), choice: at("Kapıyı"), ask: at("Sen"),
    optB: nar.words[nar.words.findIndex((w) => w.w === "al;") + 1].t0,   // the "ya" after "al;": a lowercase "ya" starts other words too
    comment: at("Yorumlara"),
    follow: at("İkinci"), end: nar.duration,
  };
};
type Q = ReturnType<typeof cues>;
type Shot = (t: number, Q: Q) => React.ReactNode;

// ---------- the phone shots ----------
const KemalAvatar: React.FC<{ size?: number; mourning?: number }> = ({ size = 54, mourning = 0 }) => <KemalBey size={size} mourning={mourning} />;
const kemalMsg = (a: number, mourning = 1): Message => ({ from: "Yönetici Kemal Bey", color: "#1F8A70", text: "Zil üç kez çalarsa açmayın. Gelen komşunuz değil.", time: "02:00", a, avatar: <KemalAvatar mourning={mourning} /> });
const nerminMsg = (a: number): Message => ({ from: "Nermin Teyze", color: "#C0703A", text: "Ben evdeyim. Benim kapımı da çalıyorlar. Sakın açma.", time: "02:03", a, avatar: <NerminAvatar /> });
const NerminAvatar: React.FC = () => (
  <svg width={54} height={54} viewBox="-100 -100 200 200"><circle r={96} fill="#E8DCC2" stroke={INK} strokeWidth={4} /><svg x={-100} y={-100} width={200} height={200} viewBox="-230 -1080 460 460" overflow="hidden"><NerminTeyze x={0} y={0} h={1000} showKey={false} /></svg></svg>
);
const phoneAt = (cx: number, cy: number, s: number): React.CSSProperties => ({ left: cx - PHONE_W / 2, top: cy - PHONE_H / 2, transform: `scale(${s})` });

const shotLock: Shot = (t, Q) => {
  // the lock screen, the notification drops in on "mesaj" · then close on it: the sender, his photo, the ribbon
  const close = ease(seg(t, Q.sender - .2, Q.sender + .5)), notif = seg(t, Q.msg, Q.msg + .45), [sx, sy] = t > Q.msg && t < Q.msg + .6 ? shake(t, 6) : [0, 0];
  const z = lerp(1.15 + .04 * t, 2.0, close), cy = lerp(960, 1035, close);   // the notification sits at y ≈ 1035
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C14" }}>
      <Cam x={540 + sx} y={cy + sy} zoom={z}>
        <Phone screen="lock" notif={notif} style={phoneAt(540, 1080, 1)} notification={{
          app: "APARTMAN GRUBU", title: "Yönetici Kemal Bey", body: "Yeni mesaj", titleColor: t > Q.dead ? RED : undefined,
          avatar: <KemalAvatar size={74} mourning={seg(t, Q.dead, Q.dead + .5)} /> }} />
      </Cam>
      <Fill a={1 - seg(t, 0, .35)} />
      <Fill color="#2A0508" a={t > Q.dead ? .35 * (1 - seg(t, Q.dead, Q.dead + 1)) : 0} />
    </AbsoluteFill>
  );
};

const shotChat: Shot = (t, Q) => {
  const z = kf(t, [[Q.rule, 1.35], [Q.seen, 1.5], [Q.seen + .6, 1.9]]), cy = kf(t, [[Q.rule, 760], [Q.seen + .6, 640]]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C14" }}>
      <Cam x={540} y={cy} zoom={z}>
        <Phone screen="chat" t={t} style={phoneAt(540, 960, 1)} members="Yönetici, Nermin Teyze, Sen ve 18 kişi"
          messages={[kemalMsg(seg(t, Q.rule, Q.rule + .3))]} seen={seg(t, Q.seen, Q.seen + .4)} seenText="Görüldü · 11 kişi" />
      </Cam>
    </AbsoluteFill>
  );
};

const shotBuilding: Shot = (t, Q) => {
  // the windows light as the message is read, then go out one by one: nobody answers
  const lit = t < Q.nobody ? 11 * seg(t, Q.seen + .9, Q.nobody - .1) : 11 * (1 - seg(t, Q.nobody, Q.ring0 - .3));
  return (
    <AbsoluteFill>
      <Cam x={540} y={kf(t, [[Q.seen + .5, 900], [Q.ring0, 980]])} zoom={kf(t, [[Q.seen + .5, 1.0], [Q.ring0, 1.12]])}><World><Building lit={lit} /></World></Cam>
      <Fill a={1 - seg(t, Q.seen + .5, Q.seen + .8)} />
      <Fill a={easeIn(seg(t, Q.ring0 - .3, Q.ring0))} />
    </AbsoluteFill>
  );
};

// ---------- the door shots ----------
const rings = (Q: Q) => [Q.ring1, Q.ring2, Q.ring3, Q.ring4t];
const shotRings: Shot = (t, Q) => {
  // wide: the hallway in the dark · one: the chime box · two: the door shudders · three: closer · into the peephole
  const r = kicks(t, rings(Q)), [sx, sy] = r > .05 ? shake(t, 12 * r) : [0, 0];
  let x = 540, y = 960, z = .8;
  if (t >= Q.ring1 && t < Q.ring2) { x = CHIME[0] - 60; y = CHIME[1]; z = 3.2; }
  else if (t >= Q.ring2 && t < Q.ring3) { x = 540; y = 1000; z = 1.15; }
  else if (t >= Q.ring3) { const into = easeIn(seg(t, Q.peek, Q.peek + .75)); x = PEEP[0]; y = lerp(820, PEEP[1], into); z = lerp(1.7, 12, into); }
  else z = lerp(.8, .92, seg(t, Q.ring0, Q.ring1));
  return (
    <AbsoluteFill>
      <Cam x={x + sx} y={y + sy} zoom={z}><World><FrontDoor ring={r} feet={t > Q.ring3 ? 1 : 0} /></World></Cam>
      <Fill a={.25} />
      <Fill a={1 - seg(t, Q.ring0, Q.ring0 + .35)} />
      <Fill a={easeIn(seg(t, Q.peek + .45, Q.peek + .75))} />
    </AbsoluteFill>
  );
};

const shotPeephole: Shot = (t, Q) => {
  // whole figure · down to the slippers · up to the key · in to the grin
  const t0 = Q.peek + .75;
  const cy = kf(t, [[t0, 1080], [Q.feet, 1080], [Q.feet + .7, 1380], [Q.key - .2, 1380], [Q.key + .6, 1000], [Q.smile, 1000], [Q.smile + .8, 820]]);
  const cx = kf(t, [[Q.key, 540], [Q.key + .6, 590], [Q.smile, 590], [Q.smile + .8, 540]]);
  const z = kf(t, [[t0, .95], [Q.feet, 1.0], [Q.feet + .7, 1.6], [Q.key - .2, 1.6], [Q.key + .6, 2.0], [Q.noKey, 2.0], [Q.smile, 2.1], [Q.smile + .8, 2.8], [Q.msg2, 2.95]]);
  return (
    <AbsoluteFill>
      <Peephole open={seg(t, t0, t0 + .45)}>
        <Cam x={cx + 4 * Math.sin(t * 1.3)} y={cy + 3 * Math.sin(t * 1.7)} zoom={z}>
          <World><Stairwell><NerminTeyze x={540} y={1480} h={780} face={t > Q.smile ? "grin" : "smile"} keyUp={ease(seg(t, Q.key, Q.key + .8))} eyeK={.8 * seg(t, Q.smile, Q.smile + 1)} tilt={t > Q.noKey && t < Q.smile ? .08 * Math.sin((t - Q.noKey) * 3) : 0} /></Stairwell></World>
        </Cam>
      </Peephole>
      <Fill a={easeIn(seg(t, Q.msg2 - .3, Q.msg2))} />
    </AbsoluteFill>
  );
};

const shotChat2: Shot = (t, Q) => {
  // the banner first (who it's from) · then the chat, her message under his
  const banner = t < Q.her;
  const [sx, sy] = t > Q.buzz2 && t < Q.buzz2 + .6 ? shake(t, 6) : [0, 0];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C14" }}>
      {banner ? (
        <Cam x={540 + sx} y={kf(t, [[Q.msg2, 980], [Q.from2, 1000], [Q.from2 + .5, 1035]]) + sy} zoom={kf(t, [[Q.msg2, 1.3], [Q.from2, 1.4], [Q.from2 + .5, 2.0]])}>
          <Phone screen="lock" clock="02:03" notif={seg(t, Q.buzz2 - .3, Q.buzz2 + .2)} style={phoneAt(540, 1080, 1)}
            notification={{ app: "APARTMAN GRUBU", title: "Nermin Teyze", body: "yazıyor…", avatar: <div style={{ transform: "scale(1.35)", margin: 8 }}><NerminAvatar /></div> }} />
        </Cam>
      ) : (
        <Cam x={540} y={kf(t, [[Q.her, 820], [Q.her + 2, 860]])} zoom={kf(t, [[Q.her, 1.6], [Q.slide, 1.75]])}>
          <Phone screen="chat" clock="02:03" t={t} style={phoneAt(540, 960, 1)} members="Yönetici, Nermin Teyze, Sen ve 18 kişi" messages={[kemalMsg(.45), nerminMsg(seg(t, Q.her, Q.her + .3))]} />
        </Cam>
      )}
      <Fill a={1 - seg(t, Q.msg2, Q.msg2 + .3)} />
      <Fill a={easeIn(seg(t, Q.slide - .3, Q.slide))} />
    </AbsoluteFill>
  );
};

// ---------- the paper ----------
const shotFloor: Shot = (t, Q) => (
  <AbsoluteFill>
    <Cam x={540} y={kf(t, [[Q.slide, 760], [Q.receipt, 900]])} zoom={kf(t, [[Q.slide, 1.0], [Q.receipt, 1.25]])}><World><FloorUnderDoor slide={easeOut(seg(t, Q.slide + .4, Q.slide + 1.8))} /></World></Cam>
    <Fill a={.2} />
    <Fill a={1 - seg(t, Q.slide, Q.slide + .3)} />
    <Fill a={easeIn(seg(t, Q.receipt - .55, Q.receipt - .25))} />
  </AbsoluteFill>
);

const shotReceipt: Shot = (t, Q) => {
  const flip = ease(seg(t, Q.back, Q.back + .7)), signIn = ease(seg(t, Q.sign - .2, Q.sign + .5)) * (1 - ease(seg(t, Q.back - .3, Q.back + .2)));
  const z = 1 + .55 * signIn, fx = 760, fy = 1080;
  const line = (t0: number) => seg(t, t0 - .15, t0 + .25);
  return (
    <AbsoluteFill style={{ backgroundColor: "#16121A" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,226,170,.28), transparent 60%)" }} />
      <AbsoluteFill style={{ transformOrigin: `${fx}px ${fy}px`, transform: `scale(${z})` }}>
        <Receipt style={{ left: 160, top: 640 }} flip={flip} mark={[2, seg(t, Q.realN, Q.realN + .5)]}
          front={{ header: "APARTMAN YÖNETİMİ", title: "AİDAT MAKBUZU", rows: [["No: 0147", "Tarih: 12.10.2023"], ["Daire: 7", "Tutar: 450,00 TL"]], role: "Yönetici", signer: "Kemal Aksoy" }}
          back={[["Telefonum bende değil.", line(Q.note)], ["Kapıdaki gerçek", line(Q.real)], ["benim.", line(Q.realN)]]} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {[-1, 1].map((s) => <PovHand key={s} x={540 + s * 400 * Math.abs(Math.cos(Math.PI * flip))} y={1170} angle={s * .5} scale={.8} />)}
        </svg>
      </AbsoluteFill>
      <Fill a={1 - seg(t, Q.receipt - .25, Q.receipt + .1)} />
      <Fill color="#2A0508" a={t > Q.real ? .3 * (1 - seg(t, Q.real, Q.real + 1.2)) : 0} />
      <Fill a={easeIn(seg(t, Q.ring4 - .3, Q.ring4))} />
    </AbsoluteFill>
  );
};

// ---------- the fourth ring, the lock, the choice ----------
const shotLockTurns: Shot = (t, Q) => {
  const r = kicks(t, rings(Q)), [sx, sy] = r > .05 ? shake(t, 14 * r) : [0, 0], into = ease(seg(t, Q.turn0, Q.turn0 + .7));
  const st = seg(t, Q.turn - .4, Q.turn + .8), turn = -Math.PI / 2 * (st < .5 ? ease(st * 2) * .5 : .5 + ease((st - .5) * 2) * .5);
  return (
    <AbsoluteFill>
      <Cam x={lerp(540, LOCK[0], into) + sx} y={lerp(980, LOCK[1], into) + sy} zoom={lerp(1.05, 4, into)}>
        <World><FrontDoor ring={r} turn={turn} feet={1} lever={-.06 * Math.max(0, Math.sin(t * 9)) * seg(t, Q.turn, Q.turn + .4)} /></World>
      </Cam>
      <Fill a={.3} />
      <Fill a={1 - seg(t, Q.ring4, Q.ring4 + .3)} />
      <Fill a={easeIn(seg(t, Q.choice - .25, Q.choice))} />
    </AbsoluteFill>
  );
};

const Half: React.FC<{ side: "A" | "B"; label: string; hi: number; children: React.ReactNode }> = ({ side, label, hi, children }) => (
  <div style={{ position: "absolute", top: 0, bottom: 0, width: 540, left: side === "A" ? 0 : 540, overflow: "hidden", filter: `brightness(${.55 + .45 * hi})` }}>
    <div style={{ position: "absolute", left: side === "A" ? 0 : -540, top: 0, width: 1080, height: 1920 }}>{children}</div>
    <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 64, color: CREAM, WebkitTextStroke: `7px ${INK}`, paintOrder: "stroke fill", lineHeight: 1.1 }}>
      <span style={{ color: RED, fontSize: 120 }}>{side}</span><br />{label}
    </div>
  </div>
);

const shotChoice: Shot = (t, Q) => {
  // the split: A, the door opening on her grin · B, your hand on the lock · then the card over the dark door
  const split = t < Q.ask, hiA = t < Q.optB ? 1 : 0, hiB = t >= Q.optB ? 1 : 0;
  const nermin = <g transform="translate(160 -60)"><NerminTeyze x={540} y={1700} h={1000} face="grin" eyeK={.8} look={[.4, 0]} /></g>;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0A0F" }}>
      {split ? (
        <>
          <Half side="A" label="KAPIYI AÇ" hi={hiA}>
            <Cam x={957} y={1000} zoom={1.05}><World><FrontDoor open={ease(seg(t, Q.choice + .2, Q.choice + 2)) * .55} feet={1} gap={nermin} /></World></Cam>
          </Half>
          <Half side="B" label="İÇERİDEN KİLİTLE" hi={hiB}>
            <Cam x={LOCK[0] - 104} y={LOCK[1] + 60} zoom={2.6}><World><FrontDoor turn={-Math.PI / 2 * (1 - ease(seg(t, Q.optB + .3, Q.optB + 1.2)))} feet={1} /><PovHand x={LOCK[0] + 10} y={LOCK[1] + 20} angle={-.25} grip={ease(seg(t, Q.optB, Q.optB + .6))} scale={.8} /></World></Cam>
          </Half>
          <div style={{ position: "absolute", left: 536, top: 0, width: 8, height: 1920, background: INK }} />
        </>
      ) : (
        <>
          <Cam x={540} y={980} zoom={1 + .03 * seg(t, Q.ask, Q.end)}><World><FrontDoor turn={-Math.PI / 2} feet={1} lever={-.05 * Math.max(0, Math.sin(t * 2.3))} /></World></Cam>
          <Fill a={.55} />
          <ChoiceCard title="NE YAPARDIN?" a={"KAPIYI\nAÇ"} b={"İÇERİDEN\nKİLİTLE"} pop={seg(t, Q.ask, Q.ask + .4)}
            hiA={seg(t, Q.comment, Q.comment + .3) * (Math.sin(t * 6) > 0 ? 1 : 0)} hiB={seg(t, Q.comment, Q.comment + .3) * (Math.sin(t * 6) > 0 ? 0 : 1)}
            footer="YORUMLARA A YA DA B YAZ" footerA={seg(t, Q.comment, Q.comment + .4)} follow="2. BÖLÜM YARIN · TAKİPTE KAL" followA={seg(t, Q.follow, Q.follow + .4)} y={330} />
        </>
      )}
      <Fill a={1 - seg(t, Q.choice, Q.choice + .3)} />
      <Fill a={easeIn(seg(t, Q.end + .4, Q.end + 1))} />
    </AbsoluteFill>
  );
};

// ---------- the sound ----------
const Sfx: React.FC<{ src: string; at: number; volume?: number; fps: number; dur?: number; loop?: boolean; fade?: [number, number] }> = ({ src, at, volume = 1, fps, dur, loop, fade = [0, 0] }) => (
  <Sequence from={Math.round(at * fps)} durationInFrames={dur ? Math.round(dur * fps) : undefined}>
    <Audio src={staticFile(src)} loop={loop} volume={(f: number) => {
      const s = f / fps, d = dur ?? 1e9;
      return volume * Math.min(1, fade[0] ? s / fade[0] : 1, fade[1] ? (d - s) / fade[1] : 1);
    }} />
  </Sequence>
);

export const ApartmanP1: React.FC<{ nar: Narration | null }> = ({ nar }) => {
  const frame = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), t = frame / fps;
  if (!nar) throw new Error("the narration wasn't loaded");
  const Q = useMemo(() => cues(nar), [nar]), DUR = durationInFrames / fps;
  const shots: [number, Shot][] = [[0, shotLock], [Q.rule, shotChat], [Q.seen + .5, shotBuilding], [Q.ring0, shotRings], [Q.peek + .75, shotPeephole],
    [Q.msg2, shotChat2], [Q.slide, shotFloor], [Q.receipt - .25, shotReceipt], [Q.ring4, shotLockTurns], [Q.choice, shotChoice]];
  let i = 0; while (i + 1 < shots.length && t >= shots[i + 1][0]) i++;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0A0F" }}>
      {shots[i][1](t, Q)}
      <Vignette />
      <Grain t={t} />
      <Captions nar={nar} t={t} />
      <Audio src={staticFile(nar.audio)} />
      <Sfx fps={fps} src="sfx/drone.wav" at={0} dur={DUR} volume={.45} loop fade={[1.5, 2]} />
      <Sfx fps={fps} src="sfx/drone.wav" at={Q.real} dur={DUR - Q.real} volume={.35} loop fade={[3, 2]} />
      <Sfx fps={fps} src="sfx/phone-buzz.wav" at={Q.msg - .1} volume={.7} />
      <Sfx fps={fps} src="sfx/phone-buzz.wav" at={Q.buzz2 - .1} volume={.7} />
      <Sfx fps={fps} src="sfx/stinger.wav" at={Q.dead} volume={.45} />
      <Sfx fps={fps} src="sfx/stinger.wav" at={Q.real} volume={.6} />
      {rings(Q).map((r) => <Sfx key={r} fps={fps} src="sfx/doorbell.wav" at={r} volume={.55} />)}
      <Sfx fps={fps} src="sfx/paper-slide.wav" at={Q.slide + .45} volume={.6} />
      <Sfx fps={fps} src="sfx/lock-turn.wav" at={Q.turn - .4} volume={.8} />
      <Sfx fps={fps} src="sfx/heartbeat.wav" at={Q.choice} dur={DUR - Q.choice} volume={.55} loop fade={[1, 1.5]} />
    </AbsoluteFill>
  );
};

export const story: StoryPart = { id: "apartman-p1", narration: "apartman-p1", component: ApartmanP1 };
