# Example: "Sen yıldız tozusun" (an explainer)

The third worked example: a science explainer in the [`glow-flat`](styles.md) style, with no story and no vote. It's also
the style's first trial. Rendered, it's [examples/stardust-p1-tr.mp4](../examples/stardust-p1-tr.mp4) (68.6 s). Rebuild it
with `./motion sfx && ./motion render yildiz 1`.

| piece | where |
|---|---|
| script | `stories/yildiz/part1/script.txt` |
| narration (Ahmet, `--gap=0.5`) | `media/narration/yildiz-p1/` |
| composition `yildiz-p1` | `modules/video/src/examples/yildiz/YildizP1.tsx` |
| library pieces it uses | `ui/GlowKit`, `GLOW` in `style.ts`, `<Captions plain>` |

Voice it again with `./motion voice yildiz 1 --voice=tr-TR-AhmetNeural`.

## The script

It opens on a claim about the viewer ("Vücudundaki neredeyse bütün atomlar, Dünya'dan daha yaşlı.") and closes on the same
viewer, watching ("Ve şimdi o toz, bu videoyu izliyor."). In between it follows one chain of cause and effect: only
hydrogen and helium, gravity, the first stars, fusion up to iron, the collapse, the dust. Facts stay short enough for one
big line on screen at a time.

## Shots

you, atoms circling you → the universe begins: only hydrogen and helium → carbon, oxygen and iron crossed out, so no you →
gravity pulls the gas in, the first star lights → the star cut open: its layers fuse from hydrogen up to iron → iron gives no
energy: the gauge falls, the star goes dark → the core collapses and it explodes → brighter than a galaxy → everything
scatters → from the dust, the Sun and the Earth → the iron, oxygen and carbon in you → you, stardust, watching this.

## Notes

- `HANDLE` at the top of `YildizP1.tsx` is the account shown at the top left, `@username` in the code: set your own before
  you render. The committed video and its previews show the account it was made for.
- The style still has known gaps: the human character and the density of detail. Its motion is our own judgement, not
  measured from reference footage.
