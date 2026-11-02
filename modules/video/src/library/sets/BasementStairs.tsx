// BasementStairs.tsx: a stairway down into a basement, seen from the top step (first person): the steps narrow towards a
// low doorway at the bottom (VP), the walls close in on both sides. World coordinates, 1080×1920 and a margin.
//   light 0..1   the light from behind you, over your shoulder (0: only what a torch shows)
//   below 0..1   a faint light at the bottom of the stairs
//   door 0..1    the basement door in front of you swings open (0: shut, filling the frame)
//   dust t       motes drifting up out of the dark (pass the time; omit for none)
import React from "react";
import { hash } from "../../lib/anim";
import { LAMP, OUT } from "../style";

export const VP: [number, number] = [540, 760];
const N = 13;

const edge = (i: number) => { const k = 1 / (1 + i * .42); return { hw: 600 * k, y: VP[1] + (2000 - VP[1]) * k }; };

export const BasementStairs: React.FC<{ light?: number; below?: number; door?: number; dust?: number }> = ({ light = 1, below = 0, door = 0, dust }) => {
  const steps = Array.from({ length: N }, (_, i) => [edge(i), edge(i + 1)] as const);
  const tone = (c: number) => `rgb(${Math.round(c * (.15 + .85 * light))},${Math.round(c * .95 * (.15 + .85 * light))},${Math.round(c * .9 * (.15 + .85 * light))})`;
  return (
    <g>
      <rect x={-400} y={-400} width={1880} height={2720} fill="#050506" />
      {/* the walls, the ceiling, the doorway at the bottom */}
      <path d={`M -400 -400 L ${VP[0] - 70} ${VP[1] - 190} L ${VP[0] - 70} ${VP[1] + 10} L -400 2320 Z`} fill={tone(52)} />
      <path d={`M 1480 -400 L ${VP[0] + 70} ${VP[1] - 190} L ${VP[0] + 70} ${VP[1] + 10} L 1480 2320 Z`} fill={tone(44)} />
      <path d={`M -400 -400 L 1480 -400 L ${VP[0] + 70} ${VP[1] - 190} L ${VP[0] - 70} ${VP[1] - 190} Z`} fill={tone(30)} />
      <rect x={VP[0] - 70} y={VP[1] - 190} width={140} height={200} fill="#0A0A0C" />
      <ellipse cx={VP[0]} cy={VP[1] - 40} rx={160 * (.4 + below)} ry={190 * (.4 + below)} fill={LAMP.glow} opacity={.18 * below} />
      {/* the steps, near to far: a tread, its nosing */}
      {steps.map(([a, b], i) => (
        <g key={i}>
          <path d={`M ${VP[0] - a.hw} ${a.y} L ${VP[0] + a.hw} ${a.y} L ${VP[0] + b.hw} ${b.y} L ${VP[0] - b.hw} ${b.y} Z`} fill={tone(i % 2 ? 70 : 84)} />
          <path d={`M ${VP[0] - b.hw} ${b.y} H ${VP[0] + b.hw}`} stroke={OUT.stroke} strokeWidth={Math.max(2, 7 / (1 + i * .3))} />
        </g>
      ))}
      {/* a rail down the left wall */}
      <path d={`M -200 1300 L ${VP[0] - 66} ${VP[1] - 40}`} stroke={tone(90)} strokeWidth={22} />
      {dust !== undefined && Array.from({ length: 26 }, (_, i) => {
        const life = (dust * .12 + hash(i)) % 1, x = VP[0] + (hash(i * 3.1) - .5) * 900 * (.3 + life), y = 1700 - life * 1300;
        return <circle key={i} cx={x} cy={y} r={2 + 5 * life} fill="#C9CED6" opacity={.35 * Math.sin(Math.PI * life)} />;
      })}
      {/* the door in front of you: it hinges on the left and swings away */}
      {door < 1 && (
        <g transform={`translate(-60 0) scale(${Math.max(.02, 1 - door)} 1) translate(60 0)`} {...OUT}>
          <rect x={-60} y={-300} width={1200} height={2520} fill={tone(78)} />
          {[-120, 820].map((py) => <rect key={py} x={120} y={py} width={840} height={760} rx={14} fill={tone(68)} strokeWidth={5} />)}
        </g>
      )}
      <g {...OUT}><rect x={-400} y={-400} width={300} height={2720} fill={tone(36)} /><rect x={1180} y={-400} width={300} height={2720} fill={tone(36)} /></g>
    </g>
  );
};
