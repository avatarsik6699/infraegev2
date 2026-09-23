# CHANGE 135 — Match images.yml matrix jobs by their real GitHub names

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `135` |
| Slug | `checkpoint-matrix-job-names` |
| Title | Match images.yml matrix jobs by their real GitHub names |
| Status | `active` |
| Branch | `feature/135-checkpoint-matrix-job-names` |

---

## Goal

The first real use of `scripts/release_checkpoint.py` (Change 132) was the Changes 132–134 release,
SHA `2cf106e`, on 2026-09-23. Both `predeploy` and `postdeploy` failed with `images.yml lacks
successful published-digest scans for: api, nginx, web`, although all three `Scan published
image` steps had succeeded. The tool expects job names like `images (web)`. GitHub names an
unnamed matrix job with every matrix value, `images (web, apps/web/Dockerfile, web-v3)`, and the
test fixtures used the short form. The architect approved deploying `2cf106e` on manually verified
evidence. This change makes the tool match the real names so the next release is not blocked the
same way.

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
- [x] `I1` Tests first. `image_jobs()` fixtures use the real GitHub matrix job names. A job whose
      first matrix value merely starts with an image name (`web-extra`) does not count as that
      image. — _Depends on:_ —
- [x] `I2` `image_evidence` identifies an image by the first matrix value in `images (…)`, so both
      `images (web)` and `images (web, apps/web/Dockerfile, web-v3)` resolve to `web`. —
      _Depends on:_ I1
- [x] `I3` Acceptance against real GitHub evidence: `predeploy` and `postdeploy --sha
      2cf106e35b0171e52ae8f1a2260ecf327d5cec30` pass. They are read-only observations of the
      already-deployed release. — _Depends on:_ I2
- [x] `I4` Found during I2: the Change 134 `nosemgrep` comment lines fail STACK.md's focused lint
      for checkpoint tooling (`ruff check … release_checkpoint.py`: E501, 103 > 100). The gate runner
      doesn't enforce that lint, so the Full Gate passed. Add `# noqa: E501` to those two lines.
      Semgrep must still honor the suppression, verified by `pnpm audit:security` with 0 findings.
      — _Depends on:_ —
- [x] `T1` `docs/KNOWN_GOTCHAS.md`: GitHub's default matrix job name contains every matrix value. —
      _Depends on:_ I2

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
scripts/release_checkpoint.py
scripts/tests/release_checkpoint_test.py
docs/KNOWN_GOTCHAS.md
~~~

### Do NOT touch
- `.github/workflows/images.yml`. Adding an explicit job `name:` would also work, but it changes a
  published workflow for a local-tool bug. The tool follows GitHub's naming instead.
- Application code and infrastructure.

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or when release risk selection requires it. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
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
fix(change-135): match images.yml matrix jobs by their real GitHub names
```
