// UnderLamp.tsx: the lamplight style's room: the dark, one ceiling lamp, its cone of light down to a lit patch of floor
// (feet at FLOOR_Y). World coordinates, wider than the frame. Whoever stands in the cone is lit; give the rest `shade`.
//   lamp 0..1     the light (dim it, flicker it)
//   cone          the cone's half-width at the floor
//   children      the people, drawn inside the light
//   front         drawn over the light (things nearer the camera: a door frame, a chair back)
import React from "react";
import { LAMP, OUT } from "../style";

export const FLOOR_Y = 1620;

export const UnderLamp: React.FC<{ lamp?: number; cone?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ lamp = 1, cone = 520, children, front }) => (
  <g>
    <defs>
      <linearGradient id="ul-cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={LAMP.glow} stopOpacity={.26 * lamp} />
        <stop offset="1" stopColor={LAMP.glow} stopOpacity={.03 * lamp} />
      </linearGradient>
      <radialGradient id="ul-floor"><stop offset="0" stopColor={LAMP.glow} stopOpacity={.22 * lamp} /><stop offset="1" stopColor={LAMP.glow} stopOpacity={0} /></radialGradient>
      <radialGradient id="ul-room"><stop offset="0" stopColor="#1C1915" stopOpacity={lamp} /><stop offset="1" stopColor={LAMP.dark} stopOpacity={1} /></radialGradient>
    </defs>
    <rect x={-1200} y={-800} width={3480} height={3600} fill={LAMP.dark} />
    <ellipse cx={540} cy={1100} rx={1300} ry={1100} fill="url(#ul-room)" />
    <rect x={-1200} y={FLOOR_Y} width={3480} height={1200} fill="#0D0C0E" />
    <ellipse cx={540} cy={FLOOR_Y + 30} rx={cone * 1.15} ry={150} fill="url(#ul-floor)" />
    <path d={`M 470 330 L ${540 - cone} ${FLOOR_Y + 60} L ${540 + cone} ${FLOOR_Y + 60} L 610 330 Z`} fill="url(#ul-cone)" />
    {children}
    <g {...OUT}>
      <path d="M 540 -800 V 250" strokeWidth={8} />
      <path d="M 410 330 Q 420 250 540 240 Q 660 250 670 330 Z" fill="#2B2826" />
      <ellipse cx={540} cy={332} rx={132} ry={26} fill={lamp > .4 ? LAMP.light : "#4A4640"} />
    </g>
    {front}
  </g>
);
