# tempo.py: slow a whole narration down (or speed it up) without voicing it again (no TTS, no credits). The pitch stays;
# the word times in narration.json stretch with it, so the captions and the shots follow (re-render after it).
#
#   python modules/narration/tempo.py --name=<story>-p<N>--factor=0.889     (voiced at --speed=0.9, now as if at 0.8)
#
# factor < 1 is slower (0.5–2). The first edit keeps the voice as it came in narration.orig.mp3 / .orig.json, and each
# run starts from that original, so trying 0.85 after 0.889 doesn't stack. A new voicing replaces it.
import argparse, json, os, shutil, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument('--name', required=True)
ap.add_argument('--factor', type=float, required=True)
ap.add_argument('--dir', default='media/narration')
a = ap.parse_args()
if not .5 <= a.factor <= 2: sys.exit('--factor must be between 0.5 and 2')

d = f'{a.dir}/{a.name}'
mp3, js = f'{d}/narration.mp3', f'{d}/narration.json'
src_mp3, src_js = f'{d}/narration.orig.mp3', f'{d}/narration.orig.json'
for f, o in ((mp3, src_mp3), (js, src_js)):
    if not os.path.exists(o): shutil.copy(f, o)
nar = json.load(open(src_js, encoding='utf-8'))
tmp = f'{d}/narration.tmp.mp3'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src_mp3, '-af', f'atempo={a.factor:.4f}', '-c:a', 'libmp3lame', '-q:a', '2', tmp], check=True)
os.replace(tmp, mp3)
for w in nar['words']: w['t0'], w['t1'] = round(w['t0'] / a.factor, 3), round(w['t1'] / a.factor, 3)
nar['duration'] = round(float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], capture_output=True, text=True, check=True).stdout), 3)
json.dump(nar, open(js, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(f'{mp3}: tempo {a.factor} → {nar["duration"]:.2f} s')
