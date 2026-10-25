# Example: "Düğmeler" (a loop dilemma)

The second worked example: the [loop-dilemmas](loop-dilemma.md) concept, on the widely shared red/blue button thought
experiment, with our own script and our own drawings. Rendered, it's
[examples/buttons-p1-tr.mp4](../examples/buttons-p1-tr.mp4) (28 s, loops). Rebuild it with
`./motion sfx && ./motion render dugmeler 1`.

| piece | where |
|---|---|
| script | `stories/dugmeler/part1/script.txt` |
| narration (Florian, a multilingual male voice reading Turkish, `--gap=0.35`) | `media/narration/dugmeler-p1/` |
| composition `dugmeler-p1` (`loop: true`) | `modules/video/src/examples/dugmeler/DugmelerP1.tsx` |
| library pieces it added | `props/BigButton`, `sets/Desk`, `sets/WindowGrid`, `ui/Counter`, `ui/Meter` |

Voice it again with `./motion voice dugmeler 1 --gap=0.35 --voice=de-DE-FlorianMultilingualNeural --lang=tr`.

## The loop

The script ends "Peki sen hangisine basarsın? Cevap vermeden önce şunu bil:", and the replay begins "Önünde iki düğme var.",
which completes it. The first and last frames are the same desk shot: the push starts after 0.6 s, and the hand and
camera settle back over the last line.

## Shots

the desk: two buttons, red (one figure on its base) and blue (a crowd), lit as they're named → "on bin kişi": out from
your window to a wall of 10,000, the counter "HAYATTA 10.000" → every window a dim lamp: nobody sees anyone's choice →
red passes half: the votes come in on the wall and the meter, the blue windows go dark, the counter falls → again,
blue passes half: nobody dies → back at the desk: red, close · blue, close → "yeterince kişi?": the meter wobbling at
half → your hand hovering between the two → it settles back, and the frame is the first frame again.

## Notes

- Florian is a multilingual voice that guesses each sentence's language. On a bare two-word question ("Hangisine
  basarsın?") it slipped into another language's accent (the user heard it; whisper's word check couldn't). A longer
  sentence keeps it in Turkish: "Peki sen hangisine basarsın?". edge-tts can't send a language tag; Azure Speech's SSML
  `<lang xml:lang="tr-TR">` can (a free tier, but it needs an account and a key).
- `./motion check` flags "tabii" → "Tabi": just spelling.
- The buttons' caps used to cover the icons on their bases; the cap now sits on the base's top face.
- The window grid is 10,000 plain SVG rects: it renders in ~30 s for a quarter-size preview.
- Glows inside an outlined group used to inherit the outline (thin black circles): `Glow` now sets `stroke="none"`.
