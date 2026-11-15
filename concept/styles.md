# Styles

Each story picks one drawing style and keeps it in every part. **The default for new stories is `lamplight`.** Every
style shares the code rules in [../AGENTS.md](../AGENTS.md): flat 2D SVG drawn in code, the outline `OUT` from
`style.ts` (#1A1420), red #E8453C as the one accent, Anton captions with the word being said in red. `glow-flat` is the
exception: it has its own outline, accent and caption rules, below.

## lamplight (default)

A dark house lit by one lamp. People are shown, not only the viewer's hands.

- **Light:** about two thirds of the frame is near-black (#000–#111). One source, usually a ceiling lamp (#B9B29D),
  throws a soft cone downward. The edges fall into a vignette. Whatever stands outside the cone is darker: a character
  who steps away from the lamp goes dim.
- **Shading:** flat fills, no gradients on objects. Depth comes only from the light cone and from darkening a whole
  shape. People who are not what they seem stand fully in shadow, with only their eyes lit.
- **Palette:** dark, muted and greyed (`LAMP` in style.ts): sage #565A40, dusty blue #6A7480, deep teal #2C3B34, charcoal
  #30343A, a dark plum for coats, skin #D4B69C, dark brown hair. A cold dark grade and a heavy vignette over every shot. Red is kept for the captions, the alert icon and one object that matters
  (a counter badge, a selected card).
- **Faces:** round heads, small ears, white eyes with a dot pupil, a thin L for the nose, and large dark circles under
  the eyes. Mouths are a flat line or a slight frown. **No open mouths and no shock faces**: fear shows in the eyes
  and the dark circles, not in the mouth. Only the antagonist may smile: a fixed closed smile, or, on the reveal, the
  mouth thrown wide open in a grin with a row of teeth (as Nermin Teyze's grin in the apartman example).
- **Who isn't right:** their bodies stay in the lamplight but their faces go dark (Person `dark`), the eyes left as dim
  pale rings: the family at the table, the ones who aren't who they look like.
- **Framing:** first-person shots (the viewer's hands, phone, notes) mixed with shots of the characters. The usual
  ones: a wide shot of the room under the lamp, two faces close up, figures standing in a row. A new shot every 3–5 s.
- **2.5D camera:** shots are built in depth layers (foreground, figures, background) that move at different speeds
  under slow push-ins and pans, as in the reference's table and hallway shots.
- **Objects carry information:** notes in Caveat on torn paper, the phone's lock screen and alerts, a bracelet.

## flat-pov

The style of the apartman and dugmeler examples.

- Flat 2D, a dark palette, red #E8453C as the one accent.
- First-person POV throughout: the viewer's hands, their phone, their door. Characters appear through a peephole, on a
  screen or across a hallway, seldom in close-up.
- Information on objects. A new shot every 3–5 s.

## glow-flat

For explainers, not horror: the bright look of science channels, saturated shapes glowing out of the dark. Its worked
example is [yildiz](example-yildiz.md). The pieces are in `library/ui/GlowKit.tsx`, the colours in `GLOW` in style.ts. Draw your own characters: take the visual language,
never someone else's mascots.

- **No outlines:** `OUT` isn't used. A shape is told from its neighbour by colour alone.
- **Backdrop:** near-black and saturated, never neutral: indigo #080828 / #080848, violet #180828, or a red-black #280808
  for heat. These were measured from reference frames, where they cover most of the picture.
- **Light is the only soft thing:** one big radial glow behind the subject (`Sky`, `Glow`). Objects themselves are flat.
- **Shading:** three hard-edged tones of one hue (`Ball`): a lighter patch toward the light, the base, and a shadow
  shifted toward purple rather than toward black. Hot things are concentric wavy bands, pale at the core.
- **Colour:** full saturation: magenta #F808B8, orange, yellow, cyan, electric blue, and white type. Keep a warm light on
  a red-black: orange over a dark background goes brown.
- **Density:** the look comes from many small things: flecks inside bands, dust, sparkles and dots filling the dark
  (`Stars`). A big plain shape reads as clip art.
- **Faces:** large white eyes, a black pupil with two highlights (`Eyes`), and a small flat mouth. Even a cell or an atom
  gets eyes, which makes a dry fact feel alive.
- **Type:** Montserrat ExtraBold, white, upper case: one big fact on screen at a time (`Title`), labels on objects
  (`Tag`), flat block arrows pointing at what matters (`Arrow`). Keep element symbols as written (`raw`: Fe, not FE).
- **Captions:** quiet: white sentence-case Montserrat, no outline, no red (`<Captions plain>`).
- **Motion:** nothing stands still: things pop in past full size and settle (`pop`), bob, twinkle, and drift in depth
  layers under a slow camera. Something new every 2–3 s. (Our own judgement, not measured from reference footage yet.)
- **Sound:** a soft synth bed (`pad`) with small effects on every appearance (`pop`, `whoosh`, `shimmer`, `boom`).

## Adding a style

Give it a short name and a section here covering: light, shading, palette (hex values), faces, framing and objects.
Base it on frames of a reference: describe what to do, never copy someone else's characters. If the style needs new
colours in code, add them to `style.ts` under the style's name instead of hard-coding them in a story.
