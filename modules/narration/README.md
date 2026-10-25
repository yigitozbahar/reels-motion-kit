# narration

`tts.py`: a part's script → `media/narration/<name>/narration.mp3` + `narration.json`
(`{ audio, duration, voice, gap, words: [{ w, t0, t1 }] }`). The video module times everything from those words.

- Voice: any edge-tts voice, `tr-TR-EmelNeural` by default at its normal rate and pitch. `--lang` (default `tr`) is the
  script's language: it's saved in narration.json, and the check and the captions follow it. `--gap=0.5` cuts each silence between
  words to 0.5 s without touching the voice. `[pause N]` in a script inserts N s of silence.
- Multilingual voices (e.g. `de-DE-FlorianMultilingualNeural` reading Turkish) guess each sentence's language: keep
  sentences longer than two or three words, or a short one can come out in another accent. The check can't hear accents.
- `check.py` (`./motion check <story> <N>`): transcribes the narration with whisper `small` (in the narration's language) and compares it word by
  word with the script: misread, skipped or extra words, stretched words, sentence ends with no pause. Run it after every
  `voice`: Claude can't hear audio. The model (~470 MB) downloads into `models/` on the first run (kept out of git). (Emel once read a sentence-final "al." as "alele"; "al;" fixed it.)
