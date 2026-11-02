# pause.py: edit a narration without voicing it again (no TTS, no credits): put a silence after one word, and optionally
# slow that word and the next one down and make them tremble ("Bu benim." → "Bu… benim!", said scared). The word times in
# narration.json move with the edit, so the captions and the shots follow. The intonation can't change: for that, voice
# the line again.
#
#   python modules/narration/pause.py --name=<story>-p<N>--after="“Bu" --secs=0.6 --slow=1.3 --shake=0.3 --as="“Bu…" --next-as="benim!”"
#
#   --after    the word the silence follows, as written in narration.json (the start of it is enough); --n picks the n-th
#   --secs     the silence (s); --slow stretches the two words (1.3: 30% longer, pitch kept); --shake 0..1 a tremble
#   --as, --next-as   how the two words are written from now on (the captions show them)
# The first edit keeps the voice as it came in narration.orig.mp3 / .orig.json. Each run edits the current narration.
import argparse, json, os, shutil, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument('--name', required=True)
ap.add_argument('--after', required=True)
ap.add_argument('--n', type=int, default=0)
ap.add_argument('--secs', type=float, default=.5)
ap.add_argument('--slow', type=float, default=1.0)
ap.add_argument('--shake', type=float, default=0.0)
ap.add_argument('--as', dest='as_', help='the word, rewritten')
ap.add_argument('--next-as', help='the next word, rewritten')
ap.add_argument('--dir', default='media/narration')
a = ap.parse_args()
if not .5 <= 1 / a.slow <= 2: sys.exit('--slow must be between 0.5 and 2')

d = f'{a.dir}/{a.name}'
mp3, js = f'{d}/narration.mp3', f'{d}/narration.json'
for f in (mp3, js):
    orig = f.replace('narration.', 'narration.orig.')
    if not os.path.exists(orig): shutil.copy(f, orig)
nar = json.load(open(js, encoding='utf-8'))
words = nar['words']
hits = [i for i, w in enumerate(words) if w['w'].startswith(a.after)]
if len(hits) <= a.n: sys.exit(f'"{a.after}" #{a.n} isn\'t in the narration')
i = hits[a.n]
if i + 1 >= len(words): sys.exit('that is the last word: nothing comes after it')
w, nx = words[i], words[i + 1]
start, cut, end = max(0, w['t0'] - .03), (w['t1'] + nx['t0']) / 2, nx['t1'] + .03
sr = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=sample_rate', '-of', 'csv=p=0', mp3], capture_output=True, text=True, check=True).stdout.strip()

fx = (f'vibrato=f=7:d={a.shake:.2f},' if a.shake else '') + f'atempo={1 / a.slow:.4f}'   # vibrato after atempo puts NaNs in (ffmpeg 7)
fmt = f'aformat=sample_rates={sr}:channel_layouts=mono'
graph = ';'.join([
    '[0]asplit=4[i0][i1][i3][i4]',
    f'[i0]atrim=0:{start:.3f},asetpts=PTS-STARTPTS,{fmt}[p0]',
    f'[i1]atrim={start:.3f}:{cut:.3f},asetpts=PTS-STARTPTS,{fx},{fmt}[p1]',
    f'anullsrc=r={sr}:cl=mono,atrim=0:{a.secs:.3f},{fmt}[p2]',
    f'[i3]atrim={cut:.3f}:{end:.3f},asetpts=PTS-STARTPTS,{fx},{fmt}[p3]',
    f'[i4]atrim={end:.3f},asetpts=PTS-STARTPTS,{fmt}[p4]',
    '[p0][p1][p2][p3][p4]concat=n=5:v=0:a=1[out]'])
tmp = f'{d}/narration.tmp.mp3'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-filter_complex', graph, '-map', '[out]', '-c:a', 'libmp3lame', '-q:a', '2', tmp], check=True)
os.replace(tmp, mp3)


def moved(t):
    if t <= start: return t
    if t <= cut: return start + (t - start) * a.slow
    if t <= end: return start + (cut - start) * a.slow + a.secs + (t - cut) * a.slow
    return t + (end - start) * (a.slow - 1) + a.secs


for x in words: x['t0'], x['t1'] = round(moved(x['t0']), 3), round(moved(x['t1']), 3)
if a.as_: w['w'] = a.as_
if a.next_as: nx['w'] = a.next_as
nar['duration'] = round(float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], capture_output=True, text=True, check=True).stdout), 3)
json.dump(nar, open(js, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(f'{mp3}: {a.secs} s after "{w["w"]}" at {w["t1"]:.2f} s{f", the two words {a.slow}× slower" if a.slow != 1 else ""} → {nar["duration"]:.2f} s')
