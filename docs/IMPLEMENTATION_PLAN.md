## CreatorPulse Implementation Plan

Status tags: [Done], [In progress], [Next], [Deferred]

### Phase 0 — Core fixes and wiring [Done]
- Sources: aligned `sync_status`, wired Sync button, RSS validation via edge function.
- Drafts: basic edit dialog (title/text) with persistence to `drafts`.
- Onboarding: persist `creator_profiles`, `content_samples`, `delivery_preferences`.
- Delivery: schedule from Drafts and Delivery Scheduling; Queue shows statuses; edit scheduled deliveries.

### Phase 1 — Delivery UX polish [Next]
- Retry failed deliveries
  - Add “Retry” in Queue to set `status='scheduled'` and `scheduled_for=now()+2m`.
  - Acceptance: item returns to Scheduled; processor can pick it up.
- Queue filters/refresh
  - Manual Refresh; filters by platform/type/date.
- Timezone consistency
  - Store UTC; render in user timezone; 9:00 remains 9:00 locally.

### Phase 2 — Email delivery MVP (Brevo) [Deferred until sender/domain ready]
- Edge function `process-delivery` sends via Brevo SMTP API.
- Required secrets: `BREVO_API_KEY`, `BREVO_FROM_EMAIL` (non‑Gmail), `BREVO_FROM_NAME` (optional).
- Cron: Supabase Scheduled Function POST body `{ "minutesAhead": 1 }` every minute.
- Acceptance: due schedules flip to sent/failed; logs visible in Brevo.

### Phase 3 — Real LLM outputs [Next]
- Enable real generation and topic research (OpenAI).
  - Secret: `OPENAI_API_KEY`.
- Feedback loop MVP
  - `draft_feedback` (👍/👎/reason); acceptance rate card on Drafts.

### Phase 4 — Draft editor improvements [Next]
- Edit hashtags/mentions; platform character counts; autosave.

### Phase 5 — Source intelligence breadth [Next]
- Social ingestion: Twitter first, then LinkedIn/Instagram.
- Source analytics: per‑source daily metrics (posts analyzed, errors).

### Phase 6 — Delivery expansion [Next]
- “Run delivery now” (admin) button to invoke `process-delivery` with `scheduleId`.
- Channel templates (email formatting presets); future: WhatsApp.

### Phase 7 — Analytics & KPIs [Next]
- Pipeline stats: totals, scheduled, sent, failed.
- Creator KPIs: acceptance rate, cadence, time‑to‑send.

### Phase 8 — Auth & OAuth [Next]
- Social OAuth (Twitter/LinkedIn/Instagram) for ingestion/publishing.
- MFA (Supabase) hardening.

### Phase 9 — Billing & Plans [Later]
- Stripe subscriptions (free/pro), usage quotas, portal.

### Phase 10 — Agency features [Later]
- Multi‑client profiles, roles, approvals.

---

## Environments & Secrets
- Current (no email): none required.
- Phase 2 (Brevo): `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, `BREVO_FROM_NAME` (optional). From must be a verified domain/sender (not Gmail).
- Phase 3 (LLM): `OPENAI_API_KEY`.
- Cron: Supabase Scheduled Function → POST `/functions/v1/process-delivery` with `{ "minutesAhead": 1 }`.

## QA / Smoke Tests
- Draft edit: change title/text → reload → persists.
- Schedule: create 2–5 min ahead; appears in Scheduled; edit time/date → updates.
- Retry: failed → retry → shows in Scheduled.
- Processor: POST with `{ "minutesAhead": 10 }` or `{ "scheduleId": "…" }` → statuses update.
- Onboarding/Profile: update name/email in Settings → saved to `creator_profiles`.

## Current Status Snapshot
- Phase 0: completed.
- Delivery Queue: edit working; shows scheduled/processing/sent/failed.
- Email: deferred until verified sender/domain.

## Next Up (suggested order)
1. Retry failed deliveries
2. Queue filters/refresh + timezone normalization
3. Rich draft editor (hashtags/mentions, counters)
4. Real LLM outputs (requires `OPENAI_API_KEY`)
5. Social ingestion (Twitter)
6. “Run delivery now” button
7. KPIs & dashboard cards


