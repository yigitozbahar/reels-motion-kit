// Bedroom.tsx: a bedroom before dawn in a storm, in world coordinates: the window (rain running down it, lightning),
// the bed on the left with its pillow, a nightstand on the right with a phone lying on it.
//   t          time (s): the rain moves
//   flash 0..1 lightning: the window goes white, the room is lit blue for a moment
//   phone 0..1 the phone on the nightstand lights up
//   sleeper    drawn on the pillow, under the duvet (a head: put it at PILLOW)
//   children   drawn in front of everything (someone standing in the room)
import React from "react";
import { hash } from "../../lib/anim";
import { OUT } from "../style";
import { Glow } from "../ui/Frame";

export const PILLOW: [number, number] = [250, 1215], NIGHTSTAND_PHONE: [number, number] = [905, 1272];
const GX = 560, GY = 300, GW = 400, GH = 580;

export const Bedroom: React.FC<{ t?: number; flash?: number; phone?: number; sleeper?: React.ReactNode; children?: React.ReactNode }> = ({ t = 0, flash = 0, phone = 0, sleeper, children }) => (
  <g {...OUT}>
    <rect x={-800} y={-800} width={2700} height={2320} fill="#262B39" stroke="none" />
    <rect x={-800} y={1520} width={2700} height={1200} fill="#33292C" />
    <ellipse cx={760} cy={1560} rx={520} ry={90} fill="#3E4660" stroke="none" opacity={.5 + .5 * flash} />
    {/* the window: the storm behind the glass, rain down it, lightning */}
    <defs><clipPath id="bedroom-glass"><rect x={GX} y={GY} width={GW} height={GH} /></clipPath></defs>
    <rect x={GX} y={GY} width={GW} height={GH} fill="#1A2033" />
    <g clipPath="url(#bedroom-glass)" stroke="none">
      <rect x={GX} y={GY} width={GW} height={GH} fill="#DDE5FF" opacity={.9 * flash} />
      {flash > .3 && <path d={`M ${GX + 230} ${GY} L ${GX + 180} ${GY + 170} L ${GX + 235} ${GY + 180} L ${GX + 160} ${GY + 400}`} fill="none" stroke="#FFFFFF" strokeWidth={9} opacity={flash} />}
      {Array.from({ length: 46 }, (_, i) => {
        const x = GX + hash(i * 1.7) * GW, y = GY + ((hash(i * 3.1) * GH + t * 900 * (.8 + .4 * hash(i * 5.3))) % GH);
        return <path key={i} d={`M ${x} ${y} l -6 44`} stroke="#8592B8" strokeWidth={3} opacity={.55} />;
      })}
    </g>
    <rect x={GX} y={GY} width={GW} height={GH} fill="none" stroke="#4D5163" strokeWidth={22} />
    <path d={`M ${GX + GW / 2} ${GY} V ${GY + GH} M ${GX} ${GY + GH / 2} H ${GX + GW}`} stroke="#4D5163" strokeWidth={14} />
    <rect x={GX - 20} y={GY + GH} width={GW + 40} height={30} rx={6} fill="#4D5163" />
    {[GX - 70, GX + GW - 20].map((cx) => <path key={cx} d={`M ${cx} 250 L ${cx + 90} 250 L ${cx + 100} 980 L ${cx - 10} 980 Z`} fill="#463A4F" />)}
    {/* the bed: headboard, pillow, whoever sleeps there, the duvet */}
    <rect x={40} y={1040} width={680} height={240} rx={18} fill="#4E3A30" />
    <rect x={40} y={1270} width={740} height={270} rx={14} fill="#D8D1C4" />
    <ellipse cx={PILLOW[0]} cy={PILLOW[1] + 10} rx={160} ry={56} fill="#DAD4C8" />
    {sleeper}
    <path d="M 300 1250 Q 520 1200 790 1260 L 800 1540 L 290 1540 Q 260 1400 300 1250 Z" fill="#48557A" />
    <path d="M 420 1300 Q 540 1340 700 1300 M 380 1420 Q 560 1460 760 1410" fill="none" stroke="#3A4566" strokeWidth={5} />
    {/* the nightstand and the phone on it */}
    <rect x={800} y={1290} width={210} height={240} rx={8} fill="#4E3A30" />
    <path d="M 815 1400 H 995" fill="none" strokeWidth={4} />
    <circle cx={905} cy={1450} r={10} fill="#C9A54E" />
    <path d={`M ${NIGHTSTAND_PHONE[0] - 50} ${NIGHTSTAND_PHONE[1] + 14} L ${NIGHTSTAND_PHONE[0] - 30} ${NIGHTSTAND_PHONE[1] - 6} L ${NIGHTSTAND_PHONE[0] + 60} ${NIGHTSTAND_PHONE[1] - 6} L ${NIGHTSTAND_PHONE[0] + 40} ${NIGHTSTAND_PHONE[1] + 14} Z`} fill={phone > .05 ? "#BFD3FF" : "#1C1A20"} strokeWidth={4} />
    <Glow id="bedroom-phone" x={NIGHTSTAND_PHONE[0]} y={NIGHTSTAND_PHONE[1]} r={340} color="#9FB8FF" a={.7 * phone} />
    <rect x={-800} y={-800} width={2700} height={3600} fill="#AFC0F0" opacity={.22 * flash} stroke="none" />
    {children}
  </g>
);
