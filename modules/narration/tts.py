# tts.py: the narration module. Speaks a story part's script with edge-tts or ElevenLabs and writes, into
# media/narration/<name>/:
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
# [voice de-DE-FlorianMultilingualNeural]“…”[/voice] reads what's inside with that voice (a character's line), the rest
# with --voice. Those words carry their voice in narration.json ({ w, t0, t1, v }), so a shot can cue on the speaker.
# --gap=0.5 shortens every silence between words to at most 0.5 s (Emel leaves about 1 s after each sentence). The voice
# itself isn't touched, and the word times move with the cuts. Pauses written as [pause N] are kept as they are.
#
# ElevenLabs: any voice name that isn't an edge-tts name (xx-XX-…Neural) is an ElevenLabs voice in your account, by its
# id or the start of its name (--voice=Ugur, [voice Asım]…[/voice]); the two engines can share a script. The key is
# ELEVENLABS_API_KEY in .env (Voices: read, Text to Speech: access). --list-voices prints the account's voices.
# --model picks the ElevenLabs model (eleven_multilingual_v2 by default; others also get --lang as language_code).
# --speed=0.9 slows ElevenLabs voices down (0.7–1.2); edge-tts voices take --rate instead. --stability lower: more emotion.
# A voice can carry its own model and settings: [voice Jessica@eleven_v3,stability=0]…[/voice] (stability, speed).
# --dialogue sends the whole script, every speaker, in one request (ElevenLabs' text-to-dialogue, eleven_v3, up to 2,000
# characters): the model voices the turns itself, so there are no seams between pieces. Voices are named in [voice …]
# tags as usual (their @model is ignored); --stability applies to all. A [pause N] splits the script into separate
# requests with N s of silence between them (each cached on its own: adding a closing line pays only for that line).
# eleven_v3 reads audio tags written in the script, [crying] [scared] [whispers]: they go to ElevenLabs but not into the
# words (or the captions). Any [tag] other than [pause N] and [voice …] is one.
# Each request is sent with the text around it (previous_text / next_text), so a line keeps the flow of the sentences
# around it. ElevenLabs bills by character, so check a script before voicing it again and again.
# --loudness=-16 brings every piece to the same level (LUFS) and keeps its peaks under 0 dB: cloned library voices come
# as loud or as quiet as their recording was (one Turkish voice arrived 24 dB under another). --loudness=0 skips it.
import argparse, asyncio, base64, hashlib, json, os, re, subprocess, sys, tempfile, time, urllib.error, urllib.request
import aiohttp, edge_tts

PUNCT_AFTER = '.,;:!?…"\'”’»)'
EDGE_VOICE = re.compile(r'^[a-z]{2,3}(-[A-Za-z]+)+Neural$')   # tr-TR-EmelNeural, de-DE-FlorianMultilingualNeural
EL_API = 'https://api.elevenlabs.io'
AUDIO_TAG = re.compile(r'\[(?!pause\s|voice\s|/voice\])[^\]]*\]\s*')   # [crying], [scared]: eleven_v3's audio tags

ap = argparse.ArgumentParser()
ap.add_argument('--name', required=True)
ap.add_argument('--text')
ap.add_argument('--file')
ap.add_argument('--voice', default='tr-TR-EmelNeural')
ap.add_argument('--rate', default='+0%')
ap.add_argument('--pitch', default='+0Hz')
ap.add_argument('--gap', type=float)
ap.add_argument('--lang', default='tr')
ap.add_argument('--retries', type=int, default=3)   # a voice that often returns nothing (tr-TR-AhmetNeural) is asked again, up to this many times
ap.add_argument('--split', action='store_true')     # one request per sentence: a flaky voice fails less on short text
ap.add_argument('--out', default='media/narration')
ap.add_argument('--model', default='eleven_multilingual_v2')
ap.add_argument('--loudness', type=float, default=-16.0)   # every piece is brought to this level (LUFS), so voices match; 0: leave as is
ap.add_argument('--speed', type=float)   # ElevenLabs only: 0.7–1.2, 1 is the voice's own pace (edge-tts uses --rate)
ap.add_argument('--stability', type=float)   # ElevenLabs only: lower is more emotional (eleven_v3 takes 0, .5 or 1)
ap.add_argument('--list-voices', action='store_true')
ap.add_argument('--dialogue', action='store_true')   # ElevenLabs only: the whole script, every voice, in one eleven_v3 request
a = ap.parse_args()


def el_key():
    k = os.environ.get('ELEVENLABS_API_KEY')
    if not k and os.path.exists('.env'):
        k = next((l.split('=', 1)[1].strip() for l in open('.env') if l.startswith('ELEVENLABS_API_KEY=')), '')
    return k or sys.exit('ELEVENLABS_API_KEY is not set: put it in .env')


def el(path, body=None):
    req = urllib.request.Request(EL_API + path, data=json.dumps(body).encode() if body else None,
                                 headers={'xi-api-key': el_key(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=120) as r: return json.load(r)
    except urllib.error.HTTPError as e:
        if e.code == 429 or e.code >= 500: raise            # busy: asked again by the retry loop
        sys.exit(f'ElevenLabs {e.code}: {e.read().decode("utf-8", "replace")[:300]}')


_el_voices = []
def el_voice(v):
    # an id, or the start of a name, case-insensitive ("ugur" → "Ugur - Turkish Documentary Narrator")
    if not _el_voices: _el_voices.extend(el('/v2/voices?page_size=100')['voices'])
    for x in _el_voices:
        if x['voice_id'] == v or x['name'].lower().startswith(v.lower()): return x['voice_id']
    if re.fullmatch(r'[A-Za-z0-9]{20}', v): return v   # a Voice Library id not added to the account: ElevenLabs may still take it
    sys.exit(f'no ElevenLabs voice "{v}" in this account (--list-voices lists them)')


if a.list_voices:
    el_voice('')
    for x in _el_voices:
        l = x.get('labels') or {}
        tr = ' [tr]' if any(v.get('language') == 'tr' for v in x.get('verified_languages') or []) else ''
        print(f"{x['voice_id']}  {x['name']}  ({', '.join(filter(None, [l.get('gender'), l.get('age'), l.get('accent')]))}){tr}")
    sys.exit()
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


async def speak(text, path, voice):
    said = []
    c = edge_tts.Communicate(text, voice, rate=a.rate, pitch=a.pitch, boundary='WordBoundary')
    with open(path, 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                t0 = ch['offset'] / 1e7; said.append((ch['text'], round(t0, 3), round(t0 + ch['duration'] / 1e7, 3)))
    return said


def speak_el(text, path, voice, before, after):
    # voice: a name or id, optionally @model,setting=value,…: "Jessica@eleven_v3,stability=0"
    name, _, rest = voice.partition('@')
    opts = [o for o in rest.split(',') if o]
    model = next((o for o in opts if '=' not in o), a.model)
    own = {k: float(v) for k, v in (o.split('=', 1) for o in opts if '=' in o)}
    body = {'text': text, 'model_id': model}
    if model != 'eleven_v3': body.update(previous_text=before or None, next_text=after or None)   # v3 refuses them
    if model != 'eleven_multilingual_v2': body['language_code'] = a.lang   # v2 refuses it
    settings = {**{k: v for k, v in (('speed', a.speed), ('stability', a.stability)) if v is not None}, **own}
    if settings: body['voice_settings'] = settings
    # every answer is kept in the narration's .cache/ (audio + timings, by what was asked): voicing a script again only
    # pays for the lines that changed, and a run that fails halfway keeps what it already paid for
    key = hashlib.sha1(json.dumps([name, body], sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]
    hit = f'{cache}/{key}.json'
    if os.path.exists(hit): d = json.load(open(hit, encoding='utf-8'))
    else:
        d = el(f'/v1/text-to-speech/{el_voice(name)}/with-timestamps?output_format=mp3_44100_128', body)
        os.makedirs(cache, exist_ok=True)
        with open(hit, 'w', encoding='utf-8') as f: json.dump(d, f)
    with open(path, 'wb') as f: f.write(base64.b64decode(d['audio_base64']))
    # ElevenLabs times characters: a word runs from its first letter to its last, the punctuation left to attach()
    al, said, run, inside = d['alignment'], [], [], False
    for c, t0, t1 in zip(al['characters'] + [' '], al['character_start_times_seconds'] + [0], al['character_end_times_seconds'] + [0]):
        if c == '[': inside = True
        if inside:                              # an audio tag: said as a feeling, not as words
            inside = c != ']'; continue
        if not c.isspace(): run.append((c, t0, t1)); continue
        letters = [i for i, (ch, _, _) in enumerate(run) if ch.isalnum()]
        if letters:
            i, j = letters[0], letters[-1]
            said.append((''.join(ch for ch, _, _ in run[i:j + 1]), round(run[i][1], 3), round(run[j][2], 3)))
        run = []
    return said


def dialogue(items, path):
    # one request for a stretch of script ([(is_tag, piece)], no pauses in it): [{text, voice_id}] turns → the audio,
    # and its words with their speakers
    turns, voice = [], a.voice
    for is_tag, p in items:
        if is_tag: voice = p[7:-1].strip() if p.startswith('[voice') else a.voice
        elif p.strip():
            name = voice.partition('@')[0]
            if turns and turns[-1][0] == name: turns[-1][1] += ' ' + p.strip()
            else: turns.append([name, p.strip()])
    body = {'inputs': [{'text': t, 'voice_id': el_voice(n)} for n, t in turns], 'model_id': 'eleven_v3', 'language_code': a.lang,
            'settings': {'stability': a.stability if a.stability is not None else .5}}
    size = sum(len(t) for _, t in turns)
    if size > 2000: sys.exit(f'{size} characters: text-to-dialogue takes at most 2,000 in one request')
    key = hashlib.sha1(json.dumps(['dialogue', body], sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]
    hit = f'{cache}/{key}.json'
    if os.path.exists(hit): d = json.load(open(hit, encoding='utf-8'))
    else:
        d = el('/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128', body)
        os.makedirs(cache, exist_ok=True)
        with open(hit, 'w', encoding='utf-8') as f: json.dump(d, f)
    with open(path, 'wb') as f: f.write(base64.b64decode(d['audio_base64']))
    owner = {}   # character index → the speaker's name, from the voice segments
    for sgm in d['voice_segments']:
        for k in range(sgm['character_start_index'], sgm['character_end_index']): owner[k] = turns[sgm['dialogue_input_index']][0]
    al, said, who, run, inside = d['alignment'], [], [], [], False
    chars = al['characters'] + [' ']
    for k, (c, t0, t1) in enumerate(zip(chars, al['character_start_times_seconds'] + [0], al['character_end_times_seconds'] + [0])):
        if c == '[': inside = True
        if inside: inside = c != ']'; continue
        turn = run and owner.get(k) != owner.get(k - 1)      # a new speaker starts a new word even without a space
        if not c.isspace() and not turn: run.append((k, c, t0, t1)); continue
        letters = [r for r in run if r[1].isalnum()]
        if letters: said.append((''.join(r[1] for r in run[run.index(letters[0]):run.index(letters[-1]) + 1]), round(letters[0][2], 3), round(letters[-1][3], 3))); who.append(owner.get(letters[0][0], a.voice))
        run = [] if c.isspace() else [(k, c, t0, t1)]
    return said, who


def level(path):
    # bring a piece to --loudness LUFS (measured over the whole piece), limiting its peaks; leave silence-only pieces alone
    if not a.loudness: return
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    got = re.findall(r'I:\s+(-?[\d.]+) LUFS', out)
    if not got or float(got[-1]) < -70: return
    tmp = path + '.lvl.mp3'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', path, '-af', f'volume={a.loudness - float(got[-1]):.2f}dB,alimiter=limit=0.95:level=false', '-c:a', 'libmp3lame', '-q:a', '2', tmp], check=True)
    os.replace(tmp, path)


def say(text, path, voice, before, after):
    if EDGE_VOICE.match(voice): return asyncio.run(speak(AUDIO_TAG.sub('', text), path, voice))   # edge-tts would read the tags out
    return speak_el(text, path, voice, before, after)


def tighten(src, dst, said, keep, fixed):
    # Cut each silence between words down to `keep` s, from its middle, so the breath around the words stays. Only what
    # is really silent in the audio is cut: a word the timings missed (eleven_v3's can be off) is never cut into. Gaps
    # that overlap a [pause N] (fixed: [(start, end)]) are left alone. Returns the words with their new times.
    det = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', src, '-af', 'silencedetect=noise=-42dB:d=0.1', '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts, ends = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', det)], [float(x) for x in re.findall(r'silence_end: (-?[\d.]+)', det)]
    quiet = list(zip(starts, ends + [duration(src)] * (len(starts) - len(ends))))
    cuts = []
    for (_, _, e), (_, s, _) in zip(said, said[1:]):
        if s - e <= keep or any(f0 < s and e < f1 for f0, f1 in fixed): continue
        for q0, q1 in quiet:
            a, b = max(q0, e - .05), min(q1, s + .05)
            if b - a > keep: cuts.append((a + keep / 2, b - keep / 2))
    merged = []
    for c0, c1 in sorted(cuts):                      # one silence can sit between several word pairs: cut it once
        if merged and c0 <= merged[-1][1]: merged[-1] = (merged[-1][0], max(merged[-1][1], c1))
        else: merged.append((c0, c1))
    cuts = merged
    keepers, at = [], 0.0
    for c0, c1 in cuts: keepers.append((at, c0)); at = c1
    keepers.append((at, None))
    sel = '+'.join(f'between(t,{k0:.3f},{k1:.3f})' if k1 is not None else f'gte(t,{k0:.3f})' for k0, k1 in keepers)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-af', f"aselect='{sel}',asetpts=N/SR/TB", '-c:a', 'libmp3lame', '-q:a', '2', dst], check=True)
    shift = lambda t: t - sum(c1 - c0 for c0, c1 in cuts if c1 <= t)
    return [(w, round(shift(t0), 3), round(shift(t1), 3)) for w, t0, t1 in said]


out = f'{a.out}/{a.name}'
cache = f'{out}/.cache'
os.makedirs(out, exist_ok=True)
mp3 = f'{out}/narration.mp3'
parts = re.split(r'(\[pause\s+[\d.]+\]|\[voice\s+[^\]\s]+\]|\[/voice\])', text)   # text, tag, text, tag, ..., text
spoken = AUDIO_TAG.sub('', ' '.join(p.strip() for p in parts[::2] if p.strip()))
said, who, at, pieces, fixed, tmp, pos = [], [], 0.0, [], [], tempfile.mkdtemp(), 0
last = None   # the voice of the last piece spoken: where the speaker changes, a breath of silence goes between them
TURN = .2
voices = [a.voice] + [p[7:-1].strip() for p in parts[1::2] if p.startswith('[voice')]
SR = 24000 if all(EDGE_VOICE.match(v) for v in voices) else 44100   # edge-tts speaks at 24 kHz, ElevenLabs at 44.1
voice = a.voice
try:
    for i, p in (enumerate(parts) if not a.dialogue else ()):
        if i % 2:                                     # a tag
            if p.startswith('[pause'):
                s = float(p[6:-1]); pieces.append(('silence', s)); fixed.append((at, at + s)); at += s
            else: voice = p[7:-1].strip() if p.startswith('[voice') else a.voice
            continue
        if not p.strip(): continue
        for j, s in enumerate(re.split(r'(?<=[.!?…:;”])\s+', p.strip()) if a.split else [p.strip()]):
            seg = f'{tmp}/{i}_{j}.mp3'
            pos = spoken.find(s, pos) if s in spoken[pos:] else pos
            before, after = spoken[:pos][-500:], spoken[pos + len(s):][:500]
            for n in range(a.retries + 1):
                try: words = say(s, seg, voice, before, after); break
                except (edge_tts.exceptions.NoAudioReceived, aiohttp.ClientError, urllib.error.URLError, TimeoutError):
                    if n == a.retries: raise
                    time.sleep(2 * (n + 1))
            pos += len(s)
            level(seg)
            if last is not None and voice != last: pieces.append(('silence', TURN)); fixed.append((at, at + TURN)); at += TURN
            last = voice
            said += [(w, round(t0 + at, 3), round(t1 + at, 3)) for w, t0, t1 in words]; who += [voice.partition('@')[0]] * len(words)
            pieces.append(('file', seg)); at += duration(seg)
    if a.dialogue:
        stretch = []
        for i, p in enumerate(parts + ['[pause 0]']):          # each stretch between pauses is one request
            if not (i % 2 and p.startswith('[pause')): stretch.append((bool(i % 2), p)); continue
            if any(not t and q.strip() for t, q in stretch):
                seg = f'{tmp}/dialogue{i}.mp3'
                words, voices_ = dialogue(stretch, seg)
                level(seg)
                said += [(w, round(t0 + at, 3), round(t1 + at, 3)) for w, t0, t1 in words]; who += voices_
                pieces.append(('file', seg)); at += duration(seg)
            gap_ = float(p[6:-1])
            if gap_ > 0 and i < len(parts): pieces.append(('silence', gap_)); fixed.append((at, at + gap_)); at += gap_
            stretch = []                                        # a stretch starts with the narrator (put pauses between narration)
except edge_tts.exceptions.NoAudioReceived:
    sys.exit(f'{voice} returned no audio: the voice may be down on Microsoft\'s side')
except (aiohttp.ClientError, urllib.error.URLError, TimeoutError) as e:
    sys.exit(f'{voice}: the voice service didn\'t answer ({e})')
inputs, chains = [], []
for i, (kind, v) in enumerate(pieces):
    inputs += ['-f', 'lavfi', '-t', str(v), '-i', f'anullsrc=r={SR}:cl=mono'] if kind == 'silence' else ['-i', v]
    fades = '' if kind == 'silence' else f',afade=t=in:d=0.012,afade=t=out:st={max(0, duration(v) - .03):.3f}:d=0.03'   # no clicks where pieces meet
    chains.append(f'[{i}]aformat=sample_rates={SR}:channel_layouts=mono{fades}[p{i}]')
graph = ';'.join(chains) + ';' + ''.join(f'[p{i}]' for i in range(len(pieces))) + f'concat=n={len(pieces)}:v=0:a=1[out]'
whole = f'{tmp}/whole.mp3'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '[out]', '-c:a', 'libmp3lame', '-q:a', '2', whole], check=True)
if a.gap is not None: said = tighten(whole, mp3, said, a.gap, fixed)
else: os.replace(whole, mp3)
dur = duration(mp3)
words = [{**w, 'v': v} if v != a.voice else w for w, v in zip(attach(spoken, said), who)]
data = {'audio': f'narration/{a.name}/narration.mp3', 'duration': round(dur, 3), 'voice': a.voice, 'lang': a.lang, 'gap': a.gap, 'words': words}
with open(f'{out}/narration.json', 'w', encoding='utf-8') as f: json.dump(data, f, ensure_ascii=False, indent=0)
print(f'{mp3}  {dur:.2f} s, {len(said)} words{f", gaps ≤ {a.gap} s" if a.gap is not None else ""} → {out}/narration.json')
