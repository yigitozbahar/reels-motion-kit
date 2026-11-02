// story.ts: what a story part hands Root.tsx: its composition id (<story>-p<N>, the name ./motion uses), the narration
// it's timed to (media/narration/<narration>/), and the component. Export it as \`story\` from a *.story.tsx file
// anywhere under src/stories/ and it registers itself.
import type React from "react";
import type { Narration } from "./narration";

// loop: the video ends right after the last word (no second of tail), so its last sentence runs into its first when
// the platform loops it; its last frame should match its first.
// cover: the reel's cover image (1080×1920), registered as the still <id>-cover: ./motion cover <story> <N>
// images: more stills by name (a story teaser, a countdown background), each <id>-<name>: ./motion image <story> <N> <name>
export type StoryPart = { id: string; narration: string; component: React.FC<{ nar: Narration | null }>; loop?: boolean; cover?: React.FC; images?: Record<string, React.FC> };
