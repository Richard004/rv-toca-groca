# Feedback Inbox — NEW only

Drop **new** voice notes or notes here. Do not put processed items in this folder.

## Workflow

1. Kids send WhatsApp voice → save `.ogg` here
2. Agent transcribes → add rows to `pending/round-2.md`
3. Add kid-friendly copy to `js/updates.js` → `PENDING_FEEDBACK`
4. Implement fixes
5. Move audio to `processed/round-N/`, move items to `SHIPPED_UPDATES`, bump `APP_VERSION`
6. Clear `PENDING_FEEDBACK` for that round

**Never** add new feedback directly into `processed/` or `SHIPPED_UPDATES` until it's done.