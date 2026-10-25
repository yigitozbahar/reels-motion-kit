// WindowGrid.tsx: a crowd as a wall of windows: cols × rows small lit squares, in world coordinates from (x0, y0),
// each cell `cell` px. tile(i) gives each window's colour (and an optional opacity), so a story can colour them by any
// rule (votes, who's alive). `you` rings one window. 100 × 100 is 10,000: plain rects, so it renders fast enough.
import React from "react";
import { INK } from "../style";

export const WindowGrid: React.FC<{ cols: number; rows: number; x0: number; y0: number; cell: number; tile: (i: number) => string; you?: number; youGlow?: number }> = ({ cols, rows, x0, y0, cell, tile, you = -1, youGlow = 1 }) => {
  const g = cell * .18, cells = [];
  for (let i = 0; i < cols * rows; i++) cells.push(<rect key={i} x={x0 + (i % cols) * cell + g / 2} y={y0 + Math.floor(i / cols) * cell + g / 2} width={cell - g} height={cell - g} fill={tile(i)} />);
  const yx = x0 + (you % cols) * cell, yy = y0 + Math.floor(you / cols) * cell;
  return (
    <g>
      <rect x={x0 - cell * 2} y={y0 - cell * 2} width={cols * cell + cell * 4} height={rows * cell + cell * 4} rx={cell} fill="#232736" stroke={INK} strokeWidth={6} />
      {cells}
      {you >= 0 && <rect x={yx - cell * .6} y={yy - cell * .6} width={cell * 2.2} height={cell * 2.2} fill="none" stroke="#FBF3E6" strokeWidth={cell * .35} opacity={youGlow} />}
    </g>
  );
};
