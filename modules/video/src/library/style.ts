// style.ts: the look every story shares: fonts (latin-ext covers Turkish and most European letters), the palette, the
// outline.
import { loadFont as anton } from "@remotion/google-fonts/Anton";
import { loadFont as roboto } from "@remotion/google-fonts/Roboto";
import { loadFont as caveat } from "@remotion/google-fonts/Caveat";

const SUB = ["latin", "latin-ext"] as ("latin" | "latin-ext")[];
export const ANTON = anton("normal", { weights: ["400"], subsets: SUB }).fontFamily;
export const ROBOTO = roboto("normal", { weights: ["400", "700"], subsets: SUB }).fontFamily;
export const CAVEAT = caveat("normal", { weights: ["500"], subsets: SUB }).fontFamily;

export const W = 1080, H = 1920;
// the part of the frame Instagram's buttons, caption and top bar leave clear
export const SAFE = { x0: 60, y0: 220, x1: 940, y1: 1500 };
export const INK = "#1A1420", CREAM = "#FBF3E6", RED = "#E8453C";
export const OUT = { stroke: INK, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// the lamplight style (concept/styles.md): one lamp in a dark house, muted greyed colours, red kept for what matters
export const LAMP = {
  dark: "#07070A", light: "#B9B29D", glow: "#FFE2B0",
  sage: "#565A40", dusty: "#6A7480", teal: "#2C3B34", charcoal: "#30343A", plum: "#433849", cream: "#D6CFC0",
  skin: "#D4B69C", skinDk: "#7A6252", hair: "#3E2C21", hairDk: "#171310", grey: "#8E8D88", trousers: "#1F1F24",
};
