# CHANGE 140 — Accounts and Server-Owned Progress

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `140` |
| Slug | `accounts-server-progress` |
| Title | Accounts and Server-Owned Progress |
| Status | `active` |
| Branch | `feature/140-accounts-server-progress` |

---

## Goal

Introduce optional accounts with email/password, VK ID, Yandex ID and Telegram sign-in, and
server-owned per-context learning progress. Preserve all guest learning and answer-checking;
guests do not accumulate progress. Discard old browser progress without migration. See
`docs/SPEC.md` §2.2, §3–§6, §8 and `docs/FRONTEND.md` §5.

---

## Backlog

### Data
- [x] `D1` Add additive account, identity, password credential, session/token and per-context progress schema with indexes, uniqueness, expiry and owner integrity; no answer text or guest data — _Depends on:_ —
- [x] `D2` Add least-privilege application write role and update schema-version checks, migration preflight, backup bundle and isolated restore verifier; verify old-release rollback compatibility — _Depends on:_ D1
- [x] `D3` Add versioned, account-bound evidence for an explicit registration privacy consent, including safe migration and account-deletion behavior; do not store unnecessary submitted form data — _Depends on:_ D1

### Backend
- [x] `B1` Implement email registration/verification, login, logout, password reset, account deletion, session rotation/revocation, CSRF and owner-scoped account reads, with bounded abuse responses — _Depends on:_ D1
- [x] `B2` Implement VK ID, Yandex ID and Telegram provider redirects/callback validation plus explicit link/unlink; do not auto-merge by email and reject unlinking the last login method — _Depends on:_ B1
- [x] `B3` Keep guest checker read-only; add authenticated atomic check-and-save for valid published lesson membership or standalone task, revision conflict and idempotence, with correctness distinct from saved status — _Depends on:_ D1, B1
- [x] `B4` Add owner-scoped, revision-aware progress projections for topic/course lessons, catalogs and standalone practice, plus narrowly scoped reset; regenerate OpenAPI/types — _Depends on:_ B3
- [x] `B5` Cover auth, provider callback, CSRF, cross-account isolation, stale/idempotent progress, guest non-persistence and error paths with API tests — _Depends on:_ B1, B2, B3, B4
- [x] `B6` Require the current password to delete an account with a verified email/password method; keep the existing recent-provider-reauth path for provider-only accounts, and reject wrong or absent proof without deleting sessions or progress; cover both paths with API tests — _Depends on:_ B1, B2
- [x] `B7` Bound verification and password-reset repeat mail requests per normalized address and purpose (cooldown and rolling cap), preserve account-enumeration-safe responses, avoid mail for already verified identities, and test abuse, expiry, delivery failure and token behavior — _Depends on:_ B1
- [x] `B8` Let a recently reauthenticated provider-only account add email and a password as a separate pending login method, verify ownership by one-time mail before it becomes usable, reject email already attached to another account without merging identities, preserve session/CSRF boundaries, and cover conflict and failure paths — _Depends on:_ B1, B2, B7
- [x] `B9` Keep add-email conflicts enumeration-safe with a neutral public response; keep verification/recovery responses identical for eligible and ineligible addresses even when a configured SMTP relay fails, retract unsent tokens, and use address-independent 503 only when SMTP is unconfigured; test both paths — _Depends on:_ B7, B8
- [x] `B10` Apply the same address-independent SMTP-failure policy to registration so a configured-relay outage cannot distinguish an existing email from a new one; cover the path — _Depends on:_ B7, B9
- [x] `B11` Keep VK ID, Yandex ID and Telegram sign-in/link/reauth behind explicit default-off release flags, expose server-owned availability for SSR and client views, fail closed when disabled, and cover every entry/callback boundary — _Depends on:_ B2
- [x] `B12` Require and record explicit versioned privacy consent in email registration, with rejection of missing consent and focused API tests; disclose that minors may register without age/guardian verification by the architect's acknowledged risk decision, without a fictitious 18+ restriction or claim that the checkbox proves guardian authority — _Depends on:_ D3, B1
- [x] `B13` Introduce bounded purging of expired/revoked account sessions, one-time tokens and provider challenges with tests and an operational schedule; preserve live-session and abuse-limit invariants — _Depends on:_ B1
- [x] `B14` Bound retention of abandoned, unverified email-only registrations so a person who cannot sign in is not kept indefinitely; preserve pending provider-linked methods and active verification links, document the period and test the cleanup — _Depends on:_ B13
- [x] `B15` Count bounded account-artifact purge results in PostgreSQL without materializing deleted identifiers; preserve exact per-table counts and pass the fresh security gate — _Depends on:_ B13, B14
- [x] `T1` Diagnose and stabilize the account-test database fixture's intermittent migration startup failure so the affected Critical Gate has trustworthy evidence — _Depends on:_ B10

### Frontend
- [x] `F1` Build accessible sign-in, registration, verification/recovery and basic account/profile/login-method screens with safe internal return path and SSR/no-JS fallback where applicable — _Depends on:_ B1, B2
- [x] `F2` Replace browser progress storage and cross-route consumers with account-scoped server progress; clear personalized in-memory state on logout/account switch and handle loading, expiry and errors — _Depends on:_ B4
- [x] `F3` Keep all guest learning/checking functional; show locked progress and sign-in invitation across lesson rail/result, topic/course catalogs, course overview and practice without fabricated zero or saved-success claims — _Depends on:_ F1, F2
- [x] `F4` Add domain-fixture E2E for guest/member flows, responsive/accessibility and degraded states; verify SSR/no-JS and personalized cache isolation — _Depends on:_ F1, F2, F3
- [x] `F5` Make account deletion collect the current password for email accounts inside the destructive confirmation flow, keep the dialog open on failure, preserve the provider-only path, and distinguish repeated sign-in from email verification in profile copy; cover the UI flow — _Depends on:_ B6, F1
- [x] `F6` Make registration, verification and password-recovery journeys recoverable: clear post-send guidance and resend control, actionable expired/missing-link routes, cooldown/rate/error feedback, unverified-login recovery, and a terminal password-reset success state; cover the states in focused UI/E2E tests — _Depends on:_ B7, F1
- [x] `F7` Resolve account-management UX dead ends within the existing account contract: preserve return to account after reauthentication, make provider unlinking deliberate, keep a failed provider-only deletion confirmation recoverable, provide an account-load retry, and remove misleading unavailable-action copy; cover affected states — _Depends on:_ F1, F5
- [x] `F8` Offer a provider-only member a clear add-email-and-password flow in the account screen, including ownership-verification instructions, pending and conflict/recovery states, without implying that matching provider email merges accounts; cover the flow in UI/E2E tests — _Depends on:_ B8, F7
- [x] `F9` Fix review-discovered recovery edges: refresh account session after email verification, provide an explicit no-JavaScript verification fallback, retain safe account return across a password-reset detour, and test successful and failed resends for both mail purposes — _Depends on:_ B9, F6, F7, F8
- [x] `F10` Redesign sign-in, registration, verification and password-recovery surfaces to match the supplied compact monochrome references: shared focused auth header, consistent form/error/loading/check-mail states, accessible password visibility, and equal-style VK/Yandex/Telegram entry points; retain all existing privacy, recovery, return-path and no-JS behavior without adding profile fields or persistent-login policy — _Depends on:_ F6, F9
- [x] `F11` Build a compact single-page account overview with a truthful Python continuation/progress summary from existing revision-aware data, learning links and clearly separated login/security settings; preserve every provider, email, logout and deletion workflow without advanced statistics or achievements — _Depends on:_ F2, F8, F10
- [x] `F12` Adapt the shared header for signed-in progress and profile-initial navigation, guest sign-in and unresolved session states, with stable desktop/mobile layout and no personal SSR leak — _Depends on:_ F1
- [x] `F13` Document the scoped visual rules and cover redesigned desktop/mobile, keyboard, loading/error, provider, recovery and account journeys with focused tests and interactive browser evidence — _Depends on:_ F10, F11, F12
- [x] `F14` Audit and polish every auth/recovery form against the supplied references: stable spacing and no-JS rendering, useful placeholders, shared accessible field help and password visibility without hover underlay; retain the 12-character password minimum — _Depends on:_ F10
- [x] `F15` Move verification resend into the registration journey, remove its separate public form and sign-in link, preserve the server 60-second/5-per-hour limit and display refresh-resistant cooldown guidance for both mail journeys; redirect successful password reset directly to sign-in — _Depends on:_ F14, B7
- [x] `F16` Make provider entry/link actions compact and visibly disabled when release flags are off, strengthen guest sign-in with avatar icon, and align the single-page account layout and existing settings with the supplied reference without invented data or tabs — _Depends on:_ B11, F11, F12, F14
- [x] `F17` Reuse existing components/icons, update visual and operational contracts, cover responsive/keyboard/no-JS/auth states with focused and interactive browser evidence, and run the affected-area Critical Gate — _Depends on:_ F14, F15, F16
- [x] `F18` Reuse the public site header across every auth/recovery route, remove the auth-only header and return link, and make guest sign-in a same-level navigation link with a forward icon and stable desktop/mobile layout — _Depends on:_ F12, F16
- [x] `F19` Refine the single-page account composition: shared avatar treatment, identity-row logout, compact equal-level login methods with contextual reauthentication, and a minimal danger-only safety section and quiet dialog cancellation; preserve all existing account flows — _Depends on:_ F5, F7, F8, F16
- [x] `F20` Replace the unstarted Python continuation with a truthful empty state and show up to one compact existing-data continuation each for course, EGE topic and standalone practice, without adding backend APIs, false recency, or invented progress — _Depends on:_ F2, F11
- [x] `F21` Codify reuse-first frontend design guidance and the revised auth/account contract, then verify the new states with focused tests and interactive desktop/mobile, keyboard and degraded-state browser evidence — _Depends on:_ F18, F19, F20
- [x] `F22` Give account login-method rows neutral surfaces instead of dividers, use a LogIn icon for guest header entry, and keep existing method/session behavior — _Depends on:_ F18, F19
- [x] `F23` Replace the account continuation's text-only empty state with a coherent neutral card and purposeful visual, retaining truthful unavailable/partial states and reuse-first composition — _Depends on:_ F20
- [x] `F24` Restore consistent zero-of-total progress visuals for guests across existing consumers without recording guest results; keep the lesson-rail progress card blurred on hover/focus with a lock explanation and sign-in action, and update SPEC/FRONTEND contracts — _Depends on:_ F2, F3
- [x] `F25` Align answer fields and check buttons in standalone practice and EGE lesson practice; present stale/unavailable-task errors with the same field-error visual language and audit related responsive states — _Depends on:_ F2, F3
- [x] `F26` Diagnose and fix the authenticated standalone-practice submission that incorrectly reports a currently available task as unavailable; retain guest/member context separation and cover the regression — _Depends on:_ B3, F2

- [x] `F27` Standardize field icons and stabilize practice answer/help layout across errors and responsive sizes — _Depends on:_ F25
- [x] `F28` Unify primary button motion and prevent wrapping button labels across all consumers — _Depends on:_ F22
- [x] `F29` Unify guest zero progress and lock overlays across catalogs, course overview and lessons, removing duplicate invitations and tooltips — _Depends on:_ F24
- [x] `F30` Differentiate account continuation cards with reusable course/topic imagery and practice icon, retaining truthful data — _Depends on:_ F23

- [x] `F31` Place the guest progress lock icon above the invitation text, centered across all shared overlay consumers — _Depends on:_ F29
- [x] `F32` Remove redundant guest progress copy on the course overview and remove illustrations from account continuation and empty-state cards while retaining neutral surfaces, real data and actions — _Depends on:_ F29, F30
- [x] `F33` Prevent no-JavaScript or pre-hydration auth forms from submitting credentials as a native GET request; cover sign-in, registration, recovery and add-email with a browser regression that never places a password in a URL — _Depends on:_ F1, F8
- [x] `F34` Stop guest checker successes and submitted answer text from entering cross-route progress stores; keep immediate correctness feedback, retain member-only server-owned success facts and cover guest solve-then-navigate behavior — _Depends on:_ F2, F3
- [x] `F35` Reject all authentication/recovery routes as `returnTo` destinations, including password reset and email verification; extend route-safety tests — _Depends on:_ F1
- [x] `F36` Present a separate unchecked, accessible registration consent linked to its own versioned text; keep the existing account/recovery/no-JS safety contract and cover the flow in UI tests — _Depends on:_ B12, F1
- [x] `F37` Reconcile the Full Gate browser page objects and journeys with the approved guest-progress and transient-answer contracts; investigate the course/practice failures without weakening genuine assertions, and rerun affected E2E scenarios — _Depends on:_ F24, F34
- [x] `F38` Diagnose and eliminate mobile horizontal overflow on the course overview detected by the Full Gate smoke journey, including loading/guest states; verify responsive browser geometry and rerun the affected scenario — _Depends on:_ F20, F29
- [x] `F39` Reserve stable course-catalog card geometry for the guest progress lock so delayed hydration and failed assets do not move adjacent cards; preserve the zero-of-total and accessible sign-in contract — _Depends on:_ F29

### Infra and documentation
- [x] `I1` Configure provider/mail secrets and callback origins, auth-specific rate limits, cookie/CSRF boundaries and sensitive-log redaction without exposing tokens to analytics — _Depends on:_ B1, B2
- [x] `I2` Update deployment/rollback and backup/restore runbooks for account data, grants and mail/provider prerequisites; test isolated restore before release — _Depends on:_ D2, I1
- [x] `I3` Make the local Docker lifecycle consume configured Athanor SMTP secrets with ordinary `make dev` (and consistent rebuild/restart behavior), without plaintext credentials or production changes; cover absent and incomplete Athanor states — _Depends on:_ I1
- [x] `T1` Update `/privacy`, operational docs and relevant contract checks for account data/retention; explicitly identify external legal and provider-app approval before production release — _Depends on:_ B1, I1
- [x] `T2` Write a detailed Russian architecture and functional guide for Change 140, including account/provider flows, server progress, deletion, trust boundaries, decision rationale, local-vs-release status and explanatory diagrams — _Depends on:_ B6, F5
- [x] `I4` Before release, provision production-only `DB_APP_PASSWORD` and `AUTH_CSRF_SECRET`, exact `PUBLIC_ORIGIN`, real Postbox SMTP settings and sender, leave provider flags off, and verify production-network mail delivery without restarting the live application — _Depends on:_ D2, I1, I2
- [x] `I5` Make the first `140_01` release procedure executable without a migration/proof cycle: after exact-SHA image publication, rehearse candidate migration and account-data backup/restore on an isolated copy of production data, record root-owned SHA attestation only from passing evidence, and block deploy on any missing proof; document and test the isolation and failure path. Execution with the final SHA remains a release-stage prerequisite — _Depends on:_ D2, I2
- [x] `I6` Reconcile account deletion with encrypted backup retention and restoration: state finite retention accurately, prevent deleted accounts from silently reappearing after restore, and test/document the operator procedure — _Depends on:_ I2
- [x] `T3` Publish accurate, separate privacy/consent texts and operator/processor/minor-facing disclosures only where facts are verified; document remaining legal decisions and the architect's acknowledged deferral of the RKN notification, without filing it or claiming legal compliance — _Depends on:_ T1

---

## Files

### Create / modify
~~~
apps/api/app/ (auth, account, progress APIs and tests)
apps/api/alembic/ (additive migrations)
apps/web/src/ (account screens, session/progress ownership, guest states)
apps/web/e2e/ (domain fixtures, Page Objects and specs)
packages/ (generated API types and relevant shared contracts)
infra/database-schema/; infra/nginx/ (schema/role and auth edge config)
scripts/ (release preflight, backup/restore verification)
docs/SPEC.md; docs/FRONTEND.md; docs/STACK.md; docs/runbooks/; docs/changes/140-accounts-server-progress.md
~~~

### Do NOT touch
- Archived changes, bank content and authored lesson theory.
- Production host or provider dashboards during local `/work`; production requires a separate authorized release.
- Payment, premium entitlements, manual completion and advanced statistics.

---

## Contracts

`docs/SPEC.md` §2.2, §3–§6, §8 and `docs/FRONTEND.md` §5 are the product contracts. The code
is the implementation source of truth. The architect confirmed account deletion and
lesson-scoped reset on 2026-09-24 before implementation. No migration of existing browser progress
and no saving accepted answer text.

---

## Gate Checks

Critical/Full/Release Gates are defined in `docs/STACK.md`. Change-specific evidence includes
guest/member browser flows, cross-account isolation, provider callback failure, password-mail
delivery, per-context revision changes, personal no-store responses and isolated account-data
restore. A local gate does not authorize production mutations.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The architect explicitly accepted releasing with no age/guardian verification, no public operator name/address and no pre-release RKN notification. The registration checkbox is not proof of guardian authority; the RKN deferral conflicts with the usual prior-notice timing in Article 22 absent an exception. These are open legal risks, not completed legal gates. Provider-created accounts must gain their own consent capture before provider flags are enabled.
- Backup restoration fails closed on deleted-account reconciliation because live hard deletion leaves no durable external tombstone; automatic proof requires a separately designed deletion ledger. The hourly retention timer is implemented but is not installed on production until an authorized release/host setup.
- `F17` passed the supported reviewed-scope Critical Gate across the affected UI/API/ops rows, four focused web test files (25 tests), all 17 account browser scenarios, cutover and deploy-preflight contracts; interactive Playwriter inspection covered desktop sign-in, mobile registration/account and recovery, with keyboard and disabled-provider states. The broad Change 140 tree still requires risk-selected Full coverage during `/ship --release`.
- A production-network STARTTLS/Postbox test message reached the architect's authorized mailbox; this verifies SMTP delivery, not application-generated verification/reset links. The architect approved an isolated production-data rehearsal before the first `140_01` deploy; no migration or SHA attestation has been run yet.
- `I5` is implemented and its failure paths pass focused tests and read-only security review: the dedicated cutover command authenticates an exact fresh Restic snapshot, requires a clean exact-SHA source and matching published image digest, rehearses on two networkless disposable database volumes and writes proof only after successful restoration and cleanup. The real production-data rehearsal and exact-SHA proof remain mandatory Release Gate actions after image publication and before dispatch; no such production rehearsal has been claimed or run during `/work`.

---

## Commit Message

```
feat(change-140): add accounts and server-owned progress
```
