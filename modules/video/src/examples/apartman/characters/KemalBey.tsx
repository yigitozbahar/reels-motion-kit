// KemalBey.tsx: the building's late manager, as his profile picture: grey hair, a moustache, glasses. A round <svg>.
//   size      px
//   mourning  0..1: a black ribbon fades in across the corner (the way a death is marked on a profile picture)
import React from "react";
import { OUT } from "../../../library/style";

export const KemalBey: React.FC<{ size: number; mourning?: number }> = ({ size, mourning = 0 }) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ display: "block" }}>
    <defs><clipPath id="kemal-round"><circle r={96} /></clipPath></defs>
    <g clipPath="url(#kemal-round)" {...OUT} strokeWidth={4}>
      <rect x={-100} y={-100} width={200} height={200} fill="#9FB3A7" stroke="none" />
      <path d="M -90 110 Q -80 40 0 34 Q 80 40 90 110 Z" fill="#4E5A6E" />
      <path d="M -22 36 L 0 70 L 22 36 Z" fill="#EDEAE2" />
      <ellipse cx={0} cy={-22} rx={52} ry={60} fill="#E8CDB4" />
      <path d="M -54 -36 Q -50 -88 0 -88 Q 50 -88 54 -36 Q 40 -66 0 -66 Q -40 -66 -54 -36 Z" fill="#C9C6C0" />
      {[-1, 1].map((s) => <circle key={s} cx={s * 22} cy={-26} r={13} fill="none" strokeWidth={3.5} />)}
      <path d="M -9 -26 h 18" strokeWidth={3} />
      {[-1, 1].map((s) => <circle key={s} cx={s * 22} cy={-26} r={3.5} fill={OUT.stroke} stroke="none" />)}
      <path d="M -26 4 Q -12 -6 0 2 Q 12 -6 26 4 Q 12 12 0 6 Q -12 12 -26 4 Z" fill="#B9B5AE" />
      <path d="M -12 20 Q 0 24 12 20" fill="none" strokeWidth={3} />
    </g>
    {mourning > 0 && <path d="M 30 -100 L 100 -30 L 100 6 L -6 -100 Z" fill="#0E0C10" opacity={mourning} />}
    <circle r={96} fill="none" stroke={OUT.stroke} strokeWidth={4} />
  </svg>
);
