# Styles

Each story picks one drawing style and keeps it in every part. **The default for new stories is `lamplight`.** Every
style shares the code rules in [../CLAUDE.md](../CLAUDE.md): flat 2D SVG drawn in code, the outline `OUT` from
`style.ts` (#1A1420), red #E8453C as the one accent, Anton captions with the word being said in red.

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

The style of the two examples (apartman, dugmeler).

- Flat 2D, a dark palette, red #E8453C as the one accent.
- First-person POV throughout: the viewer's hands, their phone, their door. Characters appear through a peephole, on a
  screen or across a hallway, seldom in close-up.
- Information on objects. A new shot every 3–5 s.

## Adding a style

Give it a short name and a section here covering: light, shading, palette (hex values), faces, framing and objects.
Base it on frames of a reference: describe what to do, never copy someone else's characters. If the style needs new
colours in code, add them to `style.ts` under the style's name instead of hard-coding them in a story.
