# Example: "Apartman", part 1

The repo's worked example: an original story built on the format guide's beat map. Rendered, it's
[examples/apartment-p1-tr.mp4](../examples/apartment-p1-tr.mp4) (69.5 s). Rebuild it with `./motion sfx && ./motion render apartman 1`.

| piece | where |
|---|---|
| script | `stories/apartman/part1/script.txt` |
| narration (Emel, `--gap=0.5`) | `media/narration/apartman-p1/` |
| composition `apartman-p1` | `modules/video/src/examples/apartman/ApartmanP1.tsx` |
| its characters | `modules/video/src/examples/apartman/characters/` (Nermin Teyze, Kemal Bey) |

## The story

At 2 a.m. the building's group chat gets a message from the manager, Kemal Bey, who died three years ago: if the bell
rings three times, don't open; whoever it is isn't your neighbour. Nobody replies. The bell rings three times. Through
the peephole: Nermin Teyze from upstairs, in her robe and slippers, holding your spare key, not using it, smiling.
Then a message from "Nermin" in the chat: she's at home, they're ringing her bell too, don't open. A note slides
under the door, on an old dues receipt signed by Kemal Bey: "Telefonum bende değil. Kapıdaki gerçek benim." The
bell rings a fourth time, and the key turns in the lock. **A:** open the door to her. **B:** lock it from inside and
keep quiet.

**The dilemma:** the chat (the dead manager's account, and "Nermin" saying she's at home) says don't open. The note
from the one at the door says the chat messages are fake: someone else has the phones.
Seeds for part 2: who holds Kemal's and Nermin's phones; why the note is on Kemal's old receipt; who turned the key.

## The shot list (about 20 shots in 69 s)

the lock screen at 02:00, a notification → close on it: the avatar gets a black ribbon and the name turns red on
"ölen" → the rule in the chat → "Görüldü · 11 kişi" → the building at night: windows light up, then go dark ("kimse
cevap yazmıyor") → the hallway, then one shot per ring (the chime box, the door, closer) → push into the peephole →
Nermin, full figure → the slippers → her hand with the silver key → her grin → the lock-screen banner from Nermin →
her chat bubble → the floor: paper slides in past her feet's shadows → the receipt's front → the signature → a 3D flip
→ the handwriting, "benim" underlined in red → the 4th ring → the lock turns by itself → split: A (the door opens on
her grin) / B (your hand on the lock) → the "NE YAPARDIN?" card and footer.

## What it taught (also in CLAUDE.md)

- The first attempt, with every frame painted brush by brush, had 8 long shots and an unreadable opening. Cutting
  every 3–5 s and carrying information on objects (phones, notes) is what made it work.
- Emel leaves about 1 s after every sentence: without `--gap=0.5` the part ran 86 s instead of 69.
- Emel read a sentence-final "al." as "alele"; "al;" fixed it. `./motion check` now flags this kind of thing.
- A line must make sense from its speaker: the note first said "the real Nermin is at the door", which made no sense
  coming from Nermin herself.
- `key` is a reserved React prop (the character uses `showKey`); a gold key vanished against the gold scarf (it's
  silver now).

## Known weak spots

- The POV hands look like fists in sleeves.
- The peephole sequence runs about 11 s with only camera moves for variety.
- The card's second footer line is small.
- Audio peaks reach 0 dB: Remotion doesn't normalise loudness.
- `./motion check` flags komşunuz→komşumuz, Gruba→buraba and aidat makbuzu→ayda atmak buzu. Listened to: they're
  whisper mishearing, not the voice.
