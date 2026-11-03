# Working on this repo

Story Reels in any language, made in code: a script is voiced, the voice's word times drive a drawn Remotion video
(the example and our concepts are Turkish). Read
[concept/README.md](concept/README.md) for what the videos are, and [README.md](README.md) for the layout and setup.

## Making a story part

1. Write `stories/<story>/part<N>/script.txt` in the story's language (ours: Turkish, second person, present tense), following
   [concept/format-guide.md](concept/format-guide.md) (a ≤5 s hook, a rule, a new beat every 3–5 s, two contradicting
   sources, the A/B close). 110–140 words is 60–85 s.
2. `./motion voice <story> <N>` (another language or voice: add `--lang=en --voice=<an edge-tts or ElevenLabs voice>`,
   see [modules/narration/README.md](modules/narration/README.md)), then **always**
   `./motion check <story> <N>`. Claude can't hear audio: the check is the only way to catch a misread word. Show its findings raw and ask the user to listen there. Fixing a misread
   means rephrasing or changing punctuation in the script ("al." read as "alele", fixed by "al;"), then voicing again.
3. Write the part as `modules/video/src/stories/<story>/<Story>P<N>.story.tsx`, exporting
   `story: StoryPart = { id: "<story>-p<N>", narration: "<story>-p<N>", component }`. It registers itself. Copy the
   shape of `src/examples/apartman/ApartmanP1.tsx`: a `cues()` reading word times with `cueAt(nar, "word", n)`, a list
   of shots `[startTime, (t, Q) => JSX]`, sounds as `<Sfx>` at cue times.
4. Look before you report: `./motion still <story> <N> <frame>` for single frames, `./motion preview` for a quarter-size
   pass you turn into a contact sheet (`ffmpeg -i out/x_preview.mp4 -vf "fps=1/2.5,scale=200:-1,tile=10x3" -frames:v 1 sheet.jpg`).
   Check that every shot frames what it means to (a zoom can land on empty screen).
5. `./motion render <story> <N> [name]` → `out/` (outside git).

A loop (concept/loop-dilemma.md) sets `loop: true` in its StoryPart: the video ends right after the last word, and
its last frame must match its first (compare `./motion still <story> <N> 0` with the last frame).

## Rules of the code

- **Reuse the library, grow it, don't redraw.** `modules/video/src/library/` holds generic pieces (`props/`, `sets/`,
  `ui/`, `style.ts`): extend them with props, and add new generic pieces there. Story-specific characters live with
  their story. A character drawn once should serve every story it's in.
- **Every shot is a pure function of t:** frames render in parallel and out of order.
- **The look:** flat 2D SVG, the outline `OUT` from style.ts (#1A1420), red #E8453C as the one accent. Each story picks
  a style from [concept/styles.md](concept/styles.md) (`lamplight` by default) and keeps it in every part. `glow-flat`,
  for explainers, has no outlines and its own colours.
- Draw only original characters and places.
- `key` is a reserved React prop: don't name a prop `key`. Mind colours that vanish against each other.
- Text goes through the browser: the fonts in style.ts load with latin-ext (ğ ş ı İ and most European letters). Upper-case
  with `toLocaleUpperCase(nar.lang)`: Turkish needs its own rule (i → İ).
- Sounds come from `modules/sound/sfx.sh` by name (`./motion sfx`). Add new ones there, story-agnostic. Peaks can reach
  0 dB, so keep effect volumes ≤ .8 under the voice.
- Modules only meet through files in `media/`. Narration JSON: `{ audio, duration, voice, lang, gap, words: [{ w, t0, t1 }] }`.

## What stays out of git

Renders (`out/`), installs (`node_modules/`, `.venv/`), the whisper model, the generated `media/sfx/`, secrets
(`.env`), and every story except the examples: `stories/`, `media/narration/` and `modules/video/src/stories/` are
local-only, so a fresh clone holds the system plus the examples (apartman, dugmeler). The example videos in
`examples/` and their README previews in `docs/` are committed once; don't replace them on every change: each version stays in
git's history for good.
