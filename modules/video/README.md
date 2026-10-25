# video

Remotion 4. Static files come from the repo's `media/` (remotion.config.ts sets it as the public dir).

- `src/library/`: drawn once, reused by every story; grow it, don't redraw.
  - `sets/`: FrontDoor, Stairwell, Building, FloorUnderDoor
  - `props/`: Phone (a lock screen or a chat), Receipt, PovHand
  - `ui/`: Captions, ChoiceCard, Peephole, Frame (Cam, World, Fill, Grain, Vignette, Glow)
  - `style.ts`: the fonts, the palette, SAFE
- `src/examples/apartman/`: the example story part, and its characters (Nermin Teyze, Kemal Bey).
- `src/stories/`: your own story parts (kept out of git). Any `*.story.tsx` exporting `story: StoryPart` registers
  itself (Root.tsx finds them with require.context).
- `src/lib/`: timing helpers (`anim.ts`), loading the narration and its cues (`narration.ts`), the `StoryPart` type.
