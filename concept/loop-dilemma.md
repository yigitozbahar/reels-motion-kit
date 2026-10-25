# Concept: loop dilemmas

A short reel (20–30 s) that puts one dilemma to the viewer and never ends: its **last sentence runs into its first**
when the platform replays it, so viewers watch it two or three times before they notice, and the comments fill with
their answers. The worked example is [example-dugmeler.md](example-dugmeler.md).

## The shape

```
[the setup, first line]  →  [the rules, one per beat]  →  [what each choice costs]  →  [the question]  →  [a half sentence that needs the first line to finish it]  ⟲
```

- **The seam:** the last line is an unfinished lead-in ("Cevap vermeden önce şunu bil:", "Ama önce şunu hatırla:")
  that the first line completes ("Önünde iki düğme var."). Read the two together aloud: they must make one sentence.
- **The last frame is the first frame:** same camera, same state, nothing glowing. Hold the first ~0.6 s still so the
  seam can't be seen; ease every move back to the opening framing over the last line.
- **No tail, no outro card, no fade to black.** The video ends ~0.1 s after the last word (`loop: true` in the
  StoryPart). A CTA would break the loop: the question itself stays on screen as a title ("KIRMIZI MI, MAVİ Mİ?"), and
  the comments are where people answer.
- **Pace:** fast. 45–60 Turkish words, `--gap=0.35`. A new picture with each rule.
- **The dilemma:** two options, each defensible and each with a cost, and no "right" answer: the argument in the
  comments is the point. Show the consequence of each option visually (a counter, a crowd, a meter), not just in words.
- **Sound:** a bed that loops cleanly (no fades at either end), hits on the consequences.

## Ideas (original or public-domain dilemmas only)

- The red/blue buttons (the example): save yourself, or save everyone if enough others do too.
- A lift that holds one more person, and two people waiting.
- A memory you can erase, and everyone who shares it forgets it too.
