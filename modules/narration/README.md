# narration

`tts.py`: a part's script → `media/narration/<name>/narration.mp3` + `narration.json`
(`{ audio, duration, voice, gap, words: [{ w, t0, t1 }] }`). The video module times everything from those words.

- Voice: any edge-tts voice, `tr-TR-EmelNeural` by default at its normal rate and pitch. `--lang` (default `tr`) is the
  script's language: it's saved in narration.json, and the check and the captions follow it. `--gap=0.5` cuts each silence between
  words to 0.5 s without touching the voice. `[pause N]` in a script inserts N s of silence. `[voice <an edge-tts voice>]…[/voice]` reads a character's line with
  another voice; those words carry it as `v` in narration.json.
- ElevenLabs: a voice name that isn't an edge-tts name (`xx-XX-…Neural`) is an ElevenLabs voice in your account, by
  id or the start of its name (`--voice=Liam`, `[voice Lily]…[/voice]`), so the two engines can share a script. It
  needs `ELEVENLABS_API_KEY` in `.env` (Voices: read, Text to Speech: access); `--list-voices` lists the account's
  voices, `[tr]` marking those verified in Turkish. `--model` picks the model (`eleven_multilingual_v2` by default), `--speed=0.9` slows the voice (0.7–1.2),
  `--stability` lower is more emotional. `--model=eleven_v3` reads audio tags written in the script (`[scared] [crying]
  “Lütfen aç!”`): they reach ElevenLabs but stay out of the words and the captions (edge-tts voices skip them).
  On a free account only ElevenLabs' own premade voices work through the API: Voice Library voices answer
  402 until the account pays. ElevenLabs bills per character: run `check` before voicing a script again. Every answer
  is cached in `media/narration/<name>/.cache/` (audio and timings, by text, voice, model and settings), so voicing a
  script again pays only for the lines that changed, and a run that fails halfway keeps what it already paid for.
- Levels: every voiced piece is brought to `--loudness` (−16 LUFS by default) with its peaks limited, so voices from
  different sources match (cloned library voices come at their recording's level: one arrived 24 dB under another).
- Multilingual voices (e.g. `de-DE-FlorianMultilingualNeural` reading Turkish) guess each sentence's language: keep
  sentences longer than two or three words, or a short one can come out in another accent. The check can't hear accents.
- `check.py` (`./motion check <story> <N>`): transcribes the narration with whisper `small` (in the narration's language) and compares it word by
  word with the script: misread, skipped or extra words, stretched words, sentence ends with no pause. Run it after every
  `voice`: Claude can't hear audio. The model (~470 MB) downloads into `models/` on the first run (kept out of git). (Emel once read a sentence-final "al." as "alele"; "al;" fixed it.)
- `pause.py`: edits a narration without voicing it again (no TTS, no credits). It puts a silence after one word and can
  slow that word and the next one down and make them tremble: `--after="“Bu" --secs=0.6 --slow=1.3 --shake=0.3
  --as="“Bu…" --next-as="benim!”"`. The word times move with the edit, so captions and shots follow; re-render after it.
  The intonation can't change (voice the line again for that). The first edit keeps the original as
  `narration.orig.mp3/.json`. A new voicing replaces the edit, so run it again afterwards.
- `tempo.py`: slows a whole narration down or speeds it up without voicing it again (no credits), pitch kept, word
  times stretched with it: `--factor=0.889` turns a `--speed=0.9` voicing into about 0.8. Each run starts from the
  original (`narration.orig.*`), so tries don't stack. A new voicing replaces it.
