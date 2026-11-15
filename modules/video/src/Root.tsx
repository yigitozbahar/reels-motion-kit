// Root.tsx: every story part, registered as a composition that runs a second past its narration (a loop: right to its
// last word). The examples live in
// src/examples/; your own stories go in src/stories/ (kept out of git) as <Story>P<N>.story.tsx files exporting \`story\`,
// and are found automatically.
import { Composition, Still } from "remotion";
import { story as apartmanP1 } from "./examples/apartman/ApartmanP1";
import { story as dugmelerP1 } from "./examples/dugmeler/DugmelerP1";
import { story as yildizP1 } from "./examples/yildiz/YildizP1";
import { loadNarration } from "./lib/narration";
import { StoryPart } from "./lib/story";

const FPS = 30;
const found = require.context("./stories", true, /\.story\.tsx$/);
const PARTS: StoryPart[] = [apartmanP1, dugmelerP1, yildizP1, ...found.keys().map((k) => (found(k) as { story: StoryPart }).story)];

export const RemotionRoot: React.FC = () => (
  <>
    {PARTS.filter((p) => p.cover).map((p) => <Still key={`${p.id}-cover`} id={`${p.id}-cover`} component={p.cover!} width={1080} height={1920} />)}
    {PARTS.map((p) => Object.keys(p.images ?? {}).map((name) => <Still key={`${p.id}-${name}`} id={`${p.id}-${name}`} component={p.images![name]} width={1080} height={1920} />))}
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
