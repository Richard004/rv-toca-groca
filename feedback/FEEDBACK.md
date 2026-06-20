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

### Round 2 — v1.2.0 (2026-06-20) ✅

See `processed/round-2/MANIFEST.md` — mobile fullscreen (⛶ button + Add to Home Screen).

---

### Round 3 — v1.3.0 (2026-06-20) ✅

See `processed/round-3/MANIFEST.md` — furniture catalog (130+ items), bathroom room, 3-level picker.

---

## Next update

### Round 4 — v1.4.0 ⏳

**Status:** Waiting for new feedback in `inbox/`

Track items in `pending/round-4.md` and `js/updates.js` → `PENDING_FEEDBACK`.

---

## Agent checklist (each new round)

1. Read files from `inbox/` only
2. Transcribe → `pending/round-N.md`
3. Add to `PENDING_FEEDBACK` in `updates.js` (kid Czech)
4. Implement
5. Move `PENDING_FEEDBACK` → new entry in `SHIPPED_UPDATES`
6. Clear `PENDING_FEEDBACK`, archive audio to `processed/round-N/`
7. Bump `APP_VERSION`, empty `inbox/`