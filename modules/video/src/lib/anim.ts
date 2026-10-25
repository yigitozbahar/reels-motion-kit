// anim.ts: timing helpers. Every scene is a pure function of the time t (s), so frames can render in any order.
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));   // 0..1 progress of t through [a, b]
export const ease = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const easeIn = (x: number) => Math.pow(clamp(x), 3);
export const backOut = (x: number) => { x = clamp(x); const s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
export const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
// keyframes [[t, value], ...], eased between neighbours, held before the first and after the last
export const kf = (t: number, keys: [number, number][], e = ease) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return lerp(v0, v1, e((t - t0) / (t1 - t0))); }
  return keys[keys.length - 1][1];
};
// a jitter that changes 24 times a second, the same for the same t: for shakes
export const shake = (t: number, amt: number): [number, number] => { const f = Math.floor(t * 24); return [(hash(f * 1.7) - .5) * 2 * amt, (hash(f * 2.3 + 9) - .5) * 2 * amt]; };
// a decaying kick on each of the given times (1 right on it): rings, hits, buzzes
export const kicks = (t: number, at: number[], k = 4, life = .9) => at.reduce((s, a) => s + (t >= a && t < a + life ? Math.exp(-(t - a) * k) : 0), 0);
