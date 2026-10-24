# CHANGE 205 — fail2ban: цепочка DOCKER-USER как параметр jail

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `205` |
| Slug | `fail2ban-chain` |
| Title | fail2ban: цепочка DOCKER-USER как параметр jail |
| Status | `archived` |
| Branch | `feature/205-fail2ban-chain` |

---

## Goal

Найдено на проде при установке jail после релиза 2026-10-24. Jail `infraege-nginx-limit` из Change
198 задавал `banaction = iptables-allports[chain="DOCKER-USER"]`, но `fail2ban-client -d`
показывал `actionstart` с `-I INPUT`. Стандартное действие `action_` передаёт `chain="%(chain)s"` из
параметров jail, и это перекрывает параметр в скобках `banaction`. Баны снова попадали бы в INPUT,
а опубликованные порты Docker эту цепочку обходят.

---

## Backlog

### Infra
- [x] `I1` `ops/fail2ban/jail.d/infraege.conf`: `banaction = iptables-allports` и `chain = DOCKER-USER`
  в секции jail. `scripts/tests/host-access-policy.test.sh` проверяет обе строки. — _Depends on:_ —
- [x] `T1` `docs/runbooks/production.md`: проверка через `fail2ban-client -d` (`-I DOCKER-USER`). —
  _Depends on:_ I1

---

## Files

### Create / modify
~~~
ops/fail2ban/jail.d/infraege.conf, scripts/tests/host-access-policy.test.sh, docs/runbooks/production.md
~~~

---

## Gate Checks

`host-access-policy` contract, shell-lint, docs-links. На хосте: дамп конфигурации из временной
копии `/etc/fail2ban` с правкой показывает `-I DOCKER-USER`, а у sshd по-прежнему `ufw`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 5302ff76+3 | host-access-policy, shell-lint, docs-links; на хосте `fail2ban-client -c <копия> -d` → `<iptables> -I DOCKER-USER -p`, у sshd ufw | PASS | ~10 |

---

## Implementation Notes

- Файл ставится на хост вручную (runbook production.md, шаг 7). Сразу после коммита он установлен на
  прод из этой же версии; следующий релиз несёт тот же файл.

---

## Commit Message

```
fix(change-205): fail2ban bans nginx abusers in DOCKER-USER for real
```
