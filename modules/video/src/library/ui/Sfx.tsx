// Sfx.tsx: a sound effect from media/sfx/ played at a time (s): optionally for dur seconds, looped, faded in and out
// over fade = [in, out] seconds.
import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

export const Sfx: React.FC<{ src: string; at: number; volume?: number; fps: number; dur?: number; loop?: boolean; fade?: [number, number] }> = ({ src, at, volume = 1, fps, dur, loop, fade = [0, 0] }) => (
  <Sequence from={Math.max(0, Math.round(at * fps))} durationInFrames={dur ? Math.max(1, Math.round(dur * fps)) : undefined}>
    <Audio src={staticFile(src)} loop={loop} volume={(f: number) => {
      const s = f / fps, d = dur ?? 1e9;
      return volume * Math.max(0, Math.min(1, fade[0] ? s / fade[0] : 1, fade[1] ? (d - s) / fade[1] : 1));
    }} />
  </Sequence>
);
