// narration.ts: the voice made by the narration module (media/narration/<name>/narration.json), and cues read from its words.
import { staticFile } from "remotion";

export type Word = { w: string; t0: number; t1: number };
export type Narration = { audio: string; duration: number; lang?: string; words: Word[] };   // lang: the script's language (tr when missing)

export const loadNarration = async (name: string): Promise<Narration> => (await fetch(staticFile(`narration/${name}/narration.json`))).json();

// the time (s) the n-th word that starts with `raw`, exactly as written, is said
export const cueAt = (nar: Narration, raw: string, n = 0) => {
  const hits = nar.words.filter((w) => w.w.startsWith(raw));
  if (!hits[n]) throw new Error(`cue: "${raw}" #${n} isn't in the narration`);
  return hits[n].t0;
};
