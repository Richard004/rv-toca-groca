# See — Grok looks at the house

I do not approve a room from memory. I photograph it, then I look.

## Why Playwright, not a new renderer

| Option | What I actually see | Speed | Use |
| --- | --- | --- | --- |
| Invent a critique from code | Nothing | Instant | Forbidden for taste |
| Coverage / height-ratio scores (`design-loop.mjs`) | Numbers that pass an ugly room | Fast | Logical smoke only |
| Node canvas / SVG export | A cousin of the game, not the game | Fast | Sprite cutouts only |
| Grok Imagine “ideal living room” | A fantasy plate, not our dolls | Medium | North-star mood only, never ship |
| **Playwright photo of the real SPA** | The same pixels a kid gets | ~2s/shot after Chrome is warm | **The loop** |

Imagine draws **sprites**. Playwright + my vision judges **the composed house**. Those are different jobs.

## The loop

1. Change art, layout, or copy.
2. `npm run see` (or `npm run see -- living`).
3. I open `audit/see/*.png` with vision.
4. I write what is empty, crowded, chopped, skewed, inconsistent, or dead.
5. I fix. I photograph again. I do not call Richard until I would play it myself.

## Shots

Phone 390×844 (the real canvas). Optional desktop later.

- splash
- furnished living / kitchen / bedroom / bathroom / garden
- cottage living
- Anetčin svět
- empty living
- tools drawer

## What I may not auto-score

Beauty. “Feels like a gift from Táta.” That is a look, not a coverage ratio.

`facts.json` only catches lies I can measure: zero-size game, chopped heads, no entities in a furnished room.
