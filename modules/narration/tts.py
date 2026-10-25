# tts.py: the narration module. Speaks a story part's script with edge-tts and writes, into media/narration/<name>/:
#   narration.mp3   the voice
#   narration.json  { audio, duration, words: [{ w, t0, t1 }] }: every spoken word, with the punctuation around it, and
#                   when it starts and ends (s). The composition reads it to time the captions and the scenes.
#
#   ./motion voice apartman 1         (the usual way: name apartman-p1, the script from stories/, --gap 0.5)
#   python modules/narration/tts.py --name=apartman-p1 --file=stories/apartman/part1/script.txt --gap=0.5
#
# Voices: any edge-tts voice (tr-TR-EmelNeural by default, at its normal rate and pitch). --lang is the script's language
# (default tr): it's saved with the narration, and the check and the captions follow it. Set it with multilingual voices
# (a de-DE-…Multilingual voice can read Turkish: its name says nothing about the script).
# [pause 3] anywhere in the text inserts 3 s of silence there (time to read something on screen).
# --gap=0.5 shortens every silence between words to at most 0.5 s (Emel leaves about 1 s after each sentence). The voice
# itself isn't touched, and the word times move with the cuts. Pauses written as [pause N] are kept as they are.
import argparse, asyncio, json, os, re, subprocess, sys, tempfile
import edge_tts

PUNCT_AFTER = '.,;:!?…"\'”’»)'

ap = argparse.ArgumentParser()
ap.add_argument('--name', required=True)
ap.add_argument('--text')
ap.add_argument('--file')
ap.add_argument('--voice', default='tr-TR-EmelNeural')
ap.add_argument('--rate', default='+0%')
ap.add_argument('--pitch', default='+0Hz')
ap.add_argument('--gap', type=float)
ap.add_argument('--lang', default='tr')
ap.add_argument('--out', default='media/narration')
a = ap.parse_args()
text = a.text if a.text else open(a.file, encoding='utf-8').read() if a.file else sys.exit('pass --text or --file')
text = ' '.join(text.split())


def attach(text, said):
    # Find each spoken word in the source text, in order, and widen it to the punctuation touching it ("kapı" → "kapı,").
    out, cur = [], 0
    for w, t0, t1 in said:
        i = text.find(w, cur)
        if i < 0: out.append({'w': w, 't0': t0, 't1': t1}); continue
        s, e = i, i + len(w)
        while s > cur and not text[s - 1].isspace(): s -= 1          # opening quotes, dashes
        while e < len(text) and text[e] in PUNCT_AFTER: e += 1
        out.append({'w': text[s:e], 't0': t0, 't1': t1}); cur = e
    return out


def duration(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True).stdout)


async def speak(text, path):
    said = []
    c = edge_tts.Communicate(text, a.voice, rate=a.rate, pitch=a.pitch, boundary='WordBoundary')
    with open(path, 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                t0 = ch['offset'] / 1e7; said.append((ch['text'], round(t0, 3), round(t0 + ch['duration'] / 1e7, 3)))
    return said


def tighten(src, dst, said, keep, fixed):
    # Cut each silence between words down to `keep` s, from its middle, so the breath around the words stays. Gaps that
    # overlap a [pause N] (fixed: [(start, end)]) are left alone. Returns the words with their new times.
    cuts = []
    for (_, _, e), (_, s, _) in zip(said, said[1:]):
        if s - e > keep and not any(f0 < s and e < f1 for f0, f1 in fixed): cuts.append((e + keep / 2, s - keep / 2))
    keepers, at = [], 0.0
    for c0, c1 in cuts: keepers.append((at, c0)); at = c1
    keepers.append((at, None))
    sel = '+'.join(f'between(t,{k0:.3f},{k1:.3f})' if k1 is not None else f'gte(t,{k0:.3f})' for k0, k1 in keepers)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-af', f"aselect='{sel}',asetpts=N/SR/TB", '-c:a', 'libmp3lame', '-q:a', '2', dst], check=True)
    shift = lambda t: t - sum(c1 - c0 for c0, c1 in cuts if c1 <= t)
    return [(w, round(shift(t0), 3), round(shift(t1), 3)) for w, t0, t1 in said]


out = f'{a.out}/{a.name}'
os.makedirs(out, exist_ok=True)
mp3 = f'{out}/narration.mp3'
parts = re.split(r'\[pause\s+([\d.]+)\]', text)   # text, seconds, text, seconds, ..., text
spoken = ' '.join(p.strip() for p in parts[::2] if p.strip())
said, at, pieces, fixed, tmp = [], 0.0, [], [], tempfile.mkdtemp()
try:
    for i, p in enumerate(parts):
        if i % 2:                                     # a pause
            pieces.append(('silence', float(p))); fixed.append((at, at + float(p))); at += float(p); continue
        if not p.strip(): continue
        seg = f'{tmp}/{i}.mp3'
        said += [(w, round(t0 + at, 3), round(t1 + at, 3)) for w, t0, t1 in asyncio.run(speak(p.strip(), seg))]
        pieces.append(('file', seg)); at += duration(seg)
except edge_tts.exceptions.NoAudioReceived:
    sys.exit(f'{a.voice} returned no audio: the voice may be down on Microsoft\'s side')
inputs, chains = [], []
for i, (kind, v) in enumerate(pieces):
    inputs += ['-f', 'lavfi', '-t', str(v), '-i', 'anullsrc=r=24000:cl=mono'] if kind == 'silence' else ['-i', v]
    chains.append(f'[{i}]aformat=sample_rates=24000:channel_layouts=mono[p{i}]')
graph = ';'.join(chains) + ';' + ''.join(f'[p{i}]' for i in range(len(pieces))) + f'concat=n={len(pieces)}:v=0:a=1[out]'
whole = f'{tmp}/whole.mp3'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[out]', '-c:a', 'libmp3lame', '-q:a', '2', whole], check=True)
if a.gap is not None: said = tighten(whole, mp3, said, a.gap, fixed)
else: os.replace(whole, mp3)
dur = duration(mp3)
data = {'audio': f'narration/{a.name}/narration.mp3', 'duration': round(dur, 3), 'voice': a.voice, 'lang': a.lang, 'gap': a.gap, 'words': attach(spoken, said)}
with open(f'{out}/narration.json', 'w', encoding='utf-8') as f: json.dump(data, f, ensure_ascii=False, indent=0)
print(f'{mp3}  {dur:.2f} s, {len(said)} words{f", gaps ≤ {a.gap} s" if a.gap is not None else ""} → {out}/narration.json')
