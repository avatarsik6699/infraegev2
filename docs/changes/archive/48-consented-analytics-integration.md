# CHANGE 48 — Consented Analytics Integration

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `48` |
| Slug | `consented-analytics-integration` |
| Title | Consented Analytics Integration |
| Status | `archived` |
| Branch | `feature/48-consented-analytics-integration` |

---

## Goal

Make infraegev2 a transparent first-party producer for the richer generic analytics contract in
sre-kit Change 22. Add explicit browser-analytics consent, truthful public processing information,
a narrow product-event allowlist and target-owned aggregate telemetry, while keeping operations
lifecycle in infraegev2 and all dashboards in sre-kit.

---

## Backlog

### Public web and legal surfaces

- [x] `F1` Add an accessible explicit opt-in control for optional browser analytics, a durable
  semantic consent adapter, withdrawal controls and consent-aware Umami loading/event delivery;
  necessary server logs and anonymous operational aggregates remain independent — _Depends on:_ —
- [x] `F2` Rewrite `/privacy` as a factual processing notice with purposes, categories, legal
  bases, retention, recipients, withdrawal/rights guidance and the architect-approved operator
  identity, home address and contacts; link consent controls from public surfaces — _Depends on:_ F1
- [x] `F3` Add a typed allowlist for coarse learning-flow events without answers, free text,
  fingerprinting, raw persistent identifiers or unbounded properties — _Depends on:_ F1

### Operations integration

- [x] `I1` Produce privacy-safe target aggregates and traffic classifications
  (`known_bot`, `suspected_automation`, `browser_analytics`, `unclassified`) from existing
  first-party signals, with documented limits and no claim that unclassified traffic is human —
  _Depends on:_ —
- [x] `I2` Extend the secret-free Source/project template and reconciliation tooling for the
  sre-kit Change 22 project, presentation and push contracts without moving target lifecycle or
  secrets into sre-kit — _Depends on:_ I1

### Verification and contracts

- [x] `T1` Update SPEC/STACK/runbooks, add unit and Page Object coverage for grant/deny/withdraw,
  verify no analytics request or product event precedes consent, validate the sibling contract,
  then pass one affected-area Critical Gate without release, deploy or production mutation —
  _Depends on:_ F1, F2, F3, I1, I2
- [x] `T2` Update the operations stack definition contract test to validate the Change 48 schema
  v2 Project, six pull Sources and one push Source — _Depends on:_ I2
- [x] `T3` Remove the Semgrep-blocking dynamic regular expression from the lesson Page Object while
  preserving its accessible-name lookup — _Depends on:_ —
- [x] `T4` Keep the unresolved analytics consent panel visible without covering or intercepting
  lesson navigation at supported viewports — _Depends on:_ F1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/changes/48-consented-analytics-integration.md
apps/web/src/**
apps/web/e2e/**
ops/observability/**
docs/runbooks/**
~~~

### Do NOT touch

- Lesson content, answers, publication status or learning-domain semantics
- Accounts, fingerprinting, covert tracking or hidden consent defaults
- Production databases/volumes, secrets, deploy, backup or rollback state
- sre-kit implementation files (owned by sibling Change 22)

---

## Contracts

- Optional browser analytics is off until a user makes a clear affirmative choice. Refusal does
  not block content; withdrawal stops future optional collection. Necessary server security and
  reliability logs are disclosed separately and do not masquerade as consented analytics.
- Event names/properties are compile-time allowlisted and coarse. Answers, free-form input,
  fingerprint material, full URLs/query/hash and durable cross-session user identifiers are banned.
- The current public contact channels are `avatarsik6699@gmail.com` and the configured Telegram
  invitation. Other personal requisites were removed later by an explicit architect decision.
- Continuing to use the site is not treated as consent. The notice records engineering facts and
  flags formal legal/Roskomnadzor review as required follow-up, not as a completed legal opinion.
- infraegev2 owns producers, classification rules and target lifecycle. sre-kit owns ingestion,
  normalized storage, retention, alerts and every analytics dashboard.

---

## Gate Checks

Run frontend lint/type/unit/build, focused Playwright journeys through repository fixtures/Page
Objects, required TypeScript LSP diagnostics, analytics network assertions before and after each
consent state, ops tests and sibling manifest/template validation. Production checks remain
read-only; no `/ship`, deploy or destructive reset.

---

## Architect Review Notes

- [x] The architect approved the consolidated scope, explicit consent direction and publication
  of the supplied home address and contacts in chat.

---

## Implementation Notes

- Server traffic logs cannot establish browser consent and therefore emit only
  `known_bot`, `suspected_automation` or `unclassified`; `browser_analytics` is produced only by
  consent-gated Umami collection.

---

## Commit Message

```
feat(analytics): add consented first-party telemetry
```
