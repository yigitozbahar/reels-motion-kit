// Root.tsx: every story part, registered as a composition that runs a second past its narration (a loop: right to its
// last word). The example lives in
// src/examples/; your own stories go in src/stories/ (kept out of git) as <Story>P<N>.story.tsx files exporting \`story\`,
// and are found automatically.
import { Composition } from "remotion";
import { story as apartmanP1 } from "./examples/apartman/ApartmanP1";
import { story as dugmelerP1 } from "./examples/dugmeler/DugmelerP1";
import { loadNarration } from "./lib/narration";
import { StoryPart } from "./lib/story";

const FPS = 30;
const found = require.context("./stories", true, /\.story\.tsx$/);
const PARTS: StoryPart[] = [apartmanP1, dugmelerP1, ...found.keys().map((k) => (found(k) as { story: StoryPart }).story)];

export const RemotionRoot: React.FC = () => (
  <>
    {PARTS.map((p) => (
      <Composition
        key={p.id}
        id={p.id}
        component={p.component}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ nar: null }}
        calculateMetadata={async () => {
          const nar = await loadNarration(p.narration);
          const end = p.loop ? nar.words[nar.words.length - 1].t1 + .12 : nar.duration + 1;
          return { durationInFrames: Math.ceil(end * FPS), props: { nar } };
        }}
      />
    ))}
  </>
);
