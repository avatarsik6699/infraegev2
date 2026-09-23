# CHANGE 133 — Reinstate cookieless browser analytics

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `133` |
| Slug | `analytics-reinstate` |
| Title | Reinstate cookieless browser analytics |
| Status | `archived` |
| Branch | `feature/133-analytics-reinstate` |

---

## Goal

Reconnect `infraege.ru` to the operator's self-hosted, cookieless site analytics
(`smotryashchiy`, `https://sre.infraege.ru`) after an explicit architect reconsideration of the
prior removal (SPEC.md §1.2/§7.3/§8.2, 2026-09-22): no site was ever actually registered there, so
today there is no traffic visibility at all. Deliver the declarative tracking snippet on every
public page, a point-in-scope CSP allowlist for that one origin, and an updated `/privacy`
disclosure — nothing else about this repo's observability posture changes.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Frontend
- [x] `F1` Add the `smotryashchiy` tracking snippet to `apps/web/src/routes/__root.tsx` via the
      route's declarative `head().scripts` array (TanStack Router asset API, not a raw
      `<script>` JSX tag): `{ src: "https://sre.infraege.ru/track.js", defer: true, "data-site":
      "a98eb46cb1aa5116e1b5cefd" }`. Renders unconditionally (no env branching — matches the
      framework's own head-script examples and avoids inventing an ad hoc `process`/`import.meta.env`
      check that Rule 9 (Web Platform Boundaries) would flag). Mechanism superseded by F3. —
      _Depends on:_ —
- [x] `F2` Update `apps/web/src/pages/privacy/privacy-page.tsx`: remove the now-false "нет
      рекламных трекеров и необязательной аналитики" claim and add a paragraph disclosing the new
      processing — operator (`smotryashchiy`, same operator, separate service), purpose (aggregate
      traffic/referrer counts), what is collected (path, referrer hostname, coarse
      browser/os/device, a daily-rotating salted visitor hash — no cookie, no persistent id, raw
      IP never stored), and that it is not used to build an individual learner profile. Bump the
      "Актуально на …" date. — _Depends on:_ —
- [x] `F3` Replace F1's `head().scripts` entry with a React 19 `<script async src=…
      data-site=…>` resource rendered in `RootDocument`'s `<head>` (hoisted and de-duplicated by
      `src`, never re-inserted by React). Found live: TanStack's head `Script` asset component
      removes the SSR tag after hydration and can re-append a fresh one on client navigation. The
      snippet then re-executes and sends a second pageview for the same URL; reproduced on
      `/` → `/courses` (trace: `script+ /courses` followed by a second `/courses` beacon). Done when
      the snippet is inserted exactly once per document load across navigations. — _Depends on:_ F1

### Infra
- [x] `I1` Add `https://sre.infraege.ru` to `script-src` and `connect-src` in
      `infra/nginx/conf.d/infraege.prod.conf`'s `Content-Security-Policy` header — that origin
      only, every other directive and value unchanged, no `unsafe-eval`, no wildcard. The local/dev
      config (`infraege.conf`) sets no CSP header today and needs no matching change. — _Depends
      on:_ —

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
apps/web/src/routes/__root.tsx
apps/web/src/pages/privacy/privacy-page.tsx
infra/nginx/conf.d/infraege.prod.conf
~~~

### Do NOT touch
- `infra/nginx/conf.d/infraege.conf` (dev/local vhost — no CSP header there, out of scope)
- Anything under the separate `smotryashchiy` repo/deploy (already shipped and live; this change
  only points `infraege.ru` at its existing public `POST /api/collect` + `GET /track.js` surface)
- No new Compose service, no Umami/Beszel/monitoring-tunnel revival (SPEC.md §7.3)

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or when release risk selection requires it. All gates are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

If this change needs a custom smoke target or other change-specific note, record it here:

```bash
# Real-browser verification (Playwriter), not just unit tests:
# 1. Load https://infraege.ru, check no CSP violation for sre.infraege.ru in the console.
# 2. Confirm the beacon reaches the server: pageview count for the infraege.ru site in
#    smotryashchiy's Analytics view increases after the load.
# 3. curl -s https://infraege.ru | grep -o 'sre.infraege.ru/track.js' — snippet present in SSR HTML.
```

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work [XX] review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

<!-- Optional. The agent adds a short bullet here only when something isn't already visible from
     the code or commit history: an intentional deviation from the plan, a residual risk, a
     rejected alternative. Leave empty when nothing needs recording — this is not a mandatory
     per-task log. -->

- Two double-counting sources were found live and fixed at their owners. (1) A same-URL
  `replaceState` during TanStack hydration was sent as a second pageview on every load; fixed in
  the snippet itself (smotryashchiy Change 16, deployed before this change ships). (2) F1's
  `head().scripts` asset re-appended the tag on client navigation and re-executed the snippet;
  fixed by F3. Both are recorded in `docs/KNOWN_GOTCHAS.md`. Verified with a MutationObserver +
  `sendBeacon` trace on a freshly started dev server: one insertion, one beacon per URL change.
- The snippet is `async` rather than `defer` because React 19 de-duplicates only async `src`
  scripts. Ordering relative to hydration no longer matters: the snippet sends the current URL on
  its first run and ignores same-URL history calls.

---

## Commit Message

```
feat(change-133): reinstate cookieless site analytics on infraege.ru
```
