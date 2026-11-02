# Concept: interactive horror stories

Turkish horror Reels, vertical 1080×1920. Each story runs over **3–6 parts** of about 60–85 s. Viewers comment A or B
under each part; the most-picked option decides how the story continues. The format rules are in
[format-guide.md](format-guide.md); the worked example is [example-apartman.md](example-apartman.md).

## Part structure

```
Part 1:      [hook ≤5 s] → [rule / warning] → [escalation] → [two sources contradict] → [squeeze] → [A/B read aloud + card] → [comment + follow]
Part 2..N-1: ["Çoğunuz A'yı seçti: <option>" or the close-vote percentages, 2–4 s] → the same arc → A/B → comment + follow
Last part:   ["SON BÖLÜM · B'yi seçtiniz"] → a resolution that pays off part 1's opening mystery → a "SON" card → "follow for the next story"
```

## Decisions

- **Narration:** second person ("sen"), present tense. One narrator voice; characters' lines arrive as on-screen text
  (chat messages, notes, bubbles). Planned: a male narrator with women's lines in Emel's voice (per-speaker voices in
  the narration module).
- **The previous choice:** show the winning option. When the vote was close, show the percentages and say it was
  close ("Oylar çok yakındı. Ama kazanan B."). Never raw vote counts.
- **A/B:** the narrator reads both options and asks "Sen olsan hangisini seçerdin?". A "NE YAPARDIN?" card with boxes A
  and B (each a 1–3 word label) stays up until the end, then "Yorumlara A ya da B yaz" and "İkinci bölüm yarın,
  takipte kal", both spoken and shown.
- **Options must read clearly to a Turkish viewer.** For example, "zinciri tak" (put the door chain on) didn't land;
  "içeriden kilitle" does.
- **Captions:** Anton, Turkish upper case, word by word, the word being said in red.
- **The look:** flat 2D drawn in code (modules/video/src/library), in a style from [styles.md](styles.md) (`lamplight`
  by default). Information through objects. A new shot every 3–5 s; phone shots short and close on the line that
  matters.
- **Recurring cast:** characters drawn once and reused across stories make a "universe". The example's Nermin Teyze
  (the neighbour from upstairs: headscarf, big eyes, a fixed smile that turns into a grin) and Kemal Bey (the late
  building manager, an avatar) are in modules/video/src/examples/apartman/characters.

## Open questions

- Music and ambience beyond the synthesised sound library.
- Whether to use a persistent HUD.
- Counting votes automatically (planned with the publishing module).
