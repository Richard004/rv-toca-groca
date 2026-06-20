# Round 6b — Processed & shipped

**Shipped in app version:** 1.6.1  
**Date:** 2026-06-20  
**Sources:** Programmer feedback (cache mixing on mobile)

| File | Role |
|------|------|
| `version.json` | Runtime fingerprint (version + git build) |
| `js/boot.js` | Bootstrap: version check, import map, SW register |
| `sw.js` | Network-first for JS/CSS/HTML |
| `scripts/sync-version.mjs` | Deploy sync for all fingerprinted URLs |

In-app copy: `js/updates.js` → `SHIPPED_UPDATES[6]`