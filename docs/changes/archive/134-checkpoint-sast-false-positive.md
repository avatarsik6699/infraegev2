# CHANGE 134 — Unblock release security scan on the checkpoint's public probe

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `134` |
| Slug | `checkpoint-sast-false-positive` |
| Title | Unblock release security scan on the checkpoint's public probe |
| Status | `archived` |
| Branch | `feature/134-checkpoint-sast-false-positive` |

---

## Goal

The first Full Gate run for a release (Change 133, 2026-09-23) failed only at `fresh-security`. All
other rows passed, including 81/81 E2E and Lighthouse. Semgrep rule
`python.lang.security.audit.dynamic-urllib-use-detected` blocks the two `urlopen` calls in
`scripts/release_checkpoint.py` (Change 132; merged but never released, so never scanned by a
release gate). The rule warns that `urllib` accepts `file://`. Here `validate_public_url()` runs
before both calls and admits only credential-free `https://` without query or fragment, so the
finding is a false positive. This change proves that with a test and records a justified per-line
suppression, so Changes 132–134 can be released together.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Infra
- [x] `I1` `scripts/tests/release_checkpoint_test.py`: `http_json` and `verify_public_release`
      reject `file://`, `http://`, credentialed, query and fragment URLs with `CheckpointError` and
      never call `urlopen`. — _Depends on:_ —
- [x] `I2` `scripts/release_checkpoint.py`: on the line before each of the two `urlopen` calls, add
      `# nosemgrep: python.lang.security.audit.dynamic-urllib-use-detected.dynamic-urllib-use-detected`
      with a one-line reason pointing to `validate_public_url`. Follow the repo's existing
      justified-suppression precedent (`infra/nginx/conf.d/infraege.conf`). No blanket rule
      disable, no `.semgrepignore` entry, no behavior change. — _Depends on:_ I1

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
scripts/release_checkpoint.py
scripts/tests/release_checkpoint_test.py
~~~

### Do NOT touch
- Semgrep configuration and `.semgrepignore`: the suppression stays per line and per rule.
- Application code, infrastructure and the deploy workflow.

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
# Optional change-specific smoke override
# curl -s http://localhost:8000/api/v1/[your-endpoint]
# expected: [describe expected response]
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

None

---

## Commit Message

```
fix(change-134): prove checkpoint probe is HTTPS-only, suppress SAST false positive
```
