# check.py: did the voice say what the script says? An AI agent can't hear audio, so this is how a narration gets checked.
# Transcribes media/narration/<name>/narration.mp3 with faster-whisper (multilingual `small`, in the narration's language)
# and compares it,
# word by word, with the words tts.py asked for. Reports, with the time of each:
#   misread   the voice said something else ("al." → "alele"), skipped a word, or added one
#   stretched a word that lasts far longer than its letters need (the voice stumbling, as "al." did: 0.55 s)
#   run-on    a sentence end with no pause after it (the voice reading on as if the sentence went on)
# Exit code 1 if anything was found. The model downloads once into modules/narration/models/ (~485 MB, not in git).
#
#   ./motion check apartman 1
#   python modules/narration/check.py --name=apartman-p1 [--model=small]
#
# Whisper hears clean TTS well but isn't perfect: read every finding as "listen here", not as proof.
import argparse, difflib, json, os, re, sys
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument('--name', required=True)
ap.add_argument('--model', default='small')
ap.add_argument('--dir', default='media/narration')
a = ap.parse_args()

here = os.path.dirname(os.path.abspath(__file__))
nar = json.load(open(f'{a.dir}/{a.name}/narration.json', encoding='utf-8'))
want = nar['words']
lang = nar.get('lang', 'tr')   # set by tts.py --lang


NUM = {n: str(i) for i, n in enumerate('sıfır bir iki üç dört beş altı yedi sekiz dokuz on'.split())}
NUM.update({n: str(i) for i, n in enumerate('birinci ikinci üçüncü dördüncü beşinci altıncı yedinci sekizinci dokuzuncu onuncu'.split(), 1)})


def norm(w):
    # lower case (Turkish: I → ı, İ → i), no punctuation or apostrophes: "Teyze'yi" and "teyzeyi" are the same word.
    # Whisper writes counts as digits ("üç" → "3", "dördüncü" → "4."), so Turkish number words become digits on both sides.
    if lang == 'tr': w = w.replace('I', 'ı').replace('İ', 'i')
    w = re.sub(r"[^\w]", '', w.lower())
    return NUM.get(w, w) if lang == 'tr' else w


model = WhisperModel(a.model, device='cpu', compute_type='int8', download_root=os.path.join(here, 'models'))
segments, _ = model.transcribe(f'{a.dir}/{a.name}/narration.mp3', language=lang, word_timestamps=True, beam_size=5, condition_on_previous_text=False)
heard = [{'w': w.word.strip(), 't0': w.start, 't1': w.end} for s in segments for w in s.words if w.word.strip()]

stamp = lambda t: f'{int(t // 60):02d}:{t % 60:05.2f}'
said = lambda ws: ' '.join(w['w'] for w in ws)
found = []

# misread: align the two word lists; anything that isn't an exact match is a finding
W, Hn = [norm(w['w']) for w in want], [norm(w['w']) for w in heard]
for op, i0, i1, j0, j1 in difflib.SequenceMatcher(None, W, Hn, autojunk=False).get_opcodes():
    if op == 'equal': continue
    t = want[i0]['t0'] if i0 < len(want) else heard[j0]['t0']
    if op == 'replace' and ''.join(W[i0:i1]) == ''.join(Hn[j0:j1]): continue   # the same letters split differently
    found.append((t, 'misread', f'script "{said(want[i0:i1])}" → heard "{said(heard[j0:j1])}"' if op != 'insert' else f'heard an extra "{said(heard[j0:j1])}"'))

# stretched: a word much longer than its letters need (the narration's own rate, per letter)
letters = [max(1, len(re.sub(r"[^\w]", '', w['w']))) for w in want]   # the word's own letters, not its digit
rate = sorted((w['t1'] - w['t0']) / n for w, n in zip(want, letters))[len(want) // 2]
for w, n, nxt in zip(want, letters, want[1:] + [None]):
    d = w['t1'] - w['t0']
    if d > 2.2 * rate * n + .12 and d > .35: found.append((w['t0'], 'stretched', f'"{w["w"]}" lasts {d:.2f} s (≈{rate * n:.2f} s expected)'))

# run-on: a sentence end straight into the next word
for w, nxt in zip(want, want[1:]):
    if re.search(r'[.!?…]["\'”’»)]*$', w['w']) and nxt['t0'] - w['t1'] < .08:
        found.append((w['t1'], 'run-on', f'no pause after "{w["w"]}" before "{nxt["w"]}"'))

print(f'{a.name}: {len(want)} words in the script, {len(heard)} heard ({a.model}, {lang})')
for t, kind, msg in sorted(found):
    print(f'  {stamp(t)}  {kind:9s}  {msg}')
print('  clean: the voice said the script' if not found else f'  {len(found)} finding(s): listen at those times')
sys.exit(1 if found else 0)
