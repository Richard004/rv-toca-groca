# Kids Feedback Log

## Structure

| Folder / file | Purpose |
|---------------|---------|
| `inbox/` | **NEW** voice notes only — drop here |
| `pending/round-N.md` | Transcribed, **not yet shipped** |
| `processed/round-N/` | Archive of shipped audio + manifest |
| `js/updates.js` | `SHIPPED_UPDATES` (done) + `PENDING_FEEDBACK` (next) |

## Shipped

### Round 1 — v1.1.0 (2026-06-20) ✅

See `processed/round-1/MANIFEST.md` and in-app **✨ Co je nového**.

14 items — all done except "víc jako Toca Boca" (ongoing art).

---

## Next update

### Round 2 — v1.2.0 ⏳

**Status:** Waiting for new feedback in `inbox/`

Track items in `pending/round-2.md` and `js/updates.js` → `PENDING_FEEDBACK`.

**Do not mix** round 2 items into round 1 / `SHIPPED_UPDATES` until implemented and shipped.

---

## Agent checklist (each new round)

1. Read files from `inbox/` only
2. Transcribe → `pending/round-N.md`
3. Add to `PENDING_FEEDBACK` in `updates.js` (kid Czech)
4. Implement
5. Move `PENDING_FEEDBACK` → new entry in `SHIPPED_UPDATES`
6. Clear `PENDING_FEEDBACK`, archive audio to `processed/round-N/`
7. Bump `APP_VERSION`, empty `inbox/`