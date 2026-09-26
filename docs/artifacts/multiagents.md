Да. В актуальном Codex это уже можно сделать **без постоянного `/model`**: модель задаётся отдельно для каждого типа subagent, а главный агент выступает оркестратором и выбирает, кому делегировать работу. Официальный механизм сейчас строится вокруг `[agents]` в `config.toml` + отдельных файлов custom agents в `.codex/agents/`. :chatgpt-content-reference{index="0"}

Я бы строил сетап примерно так:

```text
project/
├─ .codex/
│  ├─ config.toml
│  └─ agents/
│     ├─ architect.toml
│     ├─ explorer.toml
│     ├─ worker.toml
│     ├─ reviewer.toml
│     └─ tester.toml
│
└─ AGENTS.md
```

### 1. Главный агент = оркестратор

Например, `.codex/config.toml`:

```toml
model = "gpt-6-sol"
model_reasoning_effort = "high"

[agents]
enabled = true
max_concurrent_threads_per_session = 6

# fallback для обычных subagents
default_subagent_model = "gpt-6-luna"
default_subagent_reasoning_effort = "high"


[agents.architect]
description = """
Use for architecture, decomposition, difficult design decisions,
cross-cutting changes, and planning before large implementations.
"""
config_file = "./agents/architect.toml"


[agents.explorer]
description = """
Use for codebase exploration, locating relevant files,
tracing data flow, and gathering evidence before implementation.
"""
config_file = "./agents/explorer.toml"


[agents.worker]
description = """
Use for well-scoped implementation tasks after the approach is understood.
"""
config_file = "./agents/worker.toml"


[agents.reviewer]
description = """
Use after implementation to review correctness, regressions,
security risks, maintainability, and architectural problems.
"""
config_file = "./agents/reviewer.toml"


[agents.tester]
description = """
Use for writing tests, running validation, reproducing bugs,
and checking edge cases.
"""
config_file = "./agents/tester.toml"
```

Multi-agent сейчас включён по умолчанию, но я всё равно предпочёл бы явно оставить `enabled = true`. `max_concurrent_threads_per_session` ограничивает число одновременно работающих дочерних агентов. :chatgpt-content-reference{index="1"}

---

## 2. Каждой роли назначаешь свою модель

Например, архитектор:

```toml
# .codex/agents/architect.toml

name = "architect"

description = """
Architecture and planning agent for complex engineering decisions.
"""

model = "gpt-6-sol"
model_reasoning_effort = "high"

sandbox_mode = "read-only"

developer_instructions = """
Analyze the problem before implementation.

Focus on:
- architecture;
- boundaries between components;
- data flow;
- API contracts;
- failure modes;
- migration risks.

Do not modify code.

Return a concrete implementation plan for the worker.
"""
```

А explorer можно сделать существенно дешевле:

```toml
# .codex/agents/explorer.toml

name = "explorer"

description = """
Fast read-only agent for exploring the repository.
"""

model = "gpt-6-luna"
model_reasoning_effort = "high"

sandbox_mode = "read-only"

developer_instructions = """
Explore the repository and locate code relevant to the assigned task.

Do not edit files.

Return:
- relevant files;
- important functions/classes;
- execution flow;
- dependencies;
- likely change points.
"""
```

Worker:

```toml
# .codex/agents/worker.toml

name = "worker"

description = """
Implementation agent for clearly scoped coding tasks.
"""

model = "gpt-6-luna"
model_reasoning_effort = "high"

sandbox_mode = "workspace-write"

developer_instructions = """
Implement the assigned task.

Keep the change narrowly scoped.
Do not redesign unrelated code.
Run relevant tests after modifications.
Report changed files and validation performed.
"""
```

Reviewer:

```toml
# .codex/agents/reviewer.toml

name = "reviewer"

description = """
Deep review agent.
"""

model = "gpt-6-sol"
model_reasoning_effort = "high"

sandbox_mode = "read-only"

developer_instructions = """
Review the completed implementation.

Look for:
- correctness bugs;
- edge cases;
- regressions;
- security issues;
- race conditions;
- broken abstractions;
- missing validation;
- insufficient tests.

Do not edit the implementation.

Return actionable findings with file references.
"""
```

Tester:

```toml
# .codex/agents/tester.toml

name = "tester"

description = """
Testing and validation agent.
"""

model = "gpt-6-luna"
model_reasoning_effort = "high"

sandbox_mode = "workspace-write"

developer_instructions = """
Validate the implementation.

Run relevant tests.
Add focused tests when appropriate.
Try important edge cases and failure paths.

Avoid changing production code unless explicitly necessary.
"""
```

Codex официально поддерживает именно этот подход: custom agents могут иметь собственные `model`, `model_reasoning_effort`, sandbox, MCP-серверы, skills и инструкции. :chatgpt-content-reference{index="2"}

---

# 3. Самое важное — политика оркестрации

Одних файлов агентов недостаточно.

Нужно объяснить **главному Codex, когда кого использовать**.

Это удобно положить в корневой `AGENTS.md`:

```md
# Multi-agent orchestration

Act as the primary orchestrator.

For trivial or local tasks, work directly without spawning subagents.

For non-trivial tasks, decompose the problem before implementation.

## Routing

Use `explorer` for:
- repository exploration;
- locating relevant code;
- tracing unfamiliar execution flows;
- collecting context.

Use `architect` for:
- architecture decisions;
- ambiguous requirements;
- changes spanning multiple components;
- API or data model design;
- difficult refactoring.

Use `worker` for:
- well-defined implementation work;
- isolated fixes;
- mechanical changes.

Use `tester` for:
- reproducing bugs;
- writing or running tests;
- validating edge cases.

Use `reviewer` after substantial implementation.

## Parallelism

Run independent exploration or implementation tasks in parallel.

Do not parallelize tasks that modify the same files unless their
responsibilities are clearly isolated.

## Workflow

For substantial tasks prefer:

1. explorer / architect
2. worker
3. tester
4. reviewer
5. primary agent synthesizes the result

The primary agent owns the final answer and decides whether reviewer
findings require another worker pass.

Do not spawn agents merely for the sake of spawning agents.
```

`AGENTS.md` автоматически подхватывается Codex при старте сессии и предназначен именно для постоянных проектных правил. :chatgpt-content-reference{index="3"}

После этого ты можешь писать просто:

> Добавь rate limiting для API авторизации.

И желаемая логика будет примерно:

```text
                  ┌── explorer / Luna
                  │
User → Sol ───────┼── architect / Sol
      orchestrator│
                  ↓
             worker / Luna
                  │
             ┌────┴────┐
             ↓         ↓
        tester/Luna reviewer/Sol
             └────┬────┘
                  ↓
             Sol synthesizes
                  ↓
                User
```

То есть `/model` вообще не участвует.

---

# Как я бы распределил модели

Для типичного coding workflow я бы использовал такую архитектуру:

| Роль | Модель | Reasoning |
|---|---|---|
| **Orchestrator** | GPT-6 Sol | high |
| **Architect** | GPT-6 Sol | high |
| **Explorer** | GPT-6 Luna | high |
| **Worker** | GPT-6 Luna | high |
| **Tester** | GPT-6 Luna | high |
| **Reviewer** | GPT-6 Sol | high |

Это соответствует текущей рекомендации OpenAI: Sol — для неоднозначной, многошаговой работы и сложного reasoning, Luna — для быстрых, узких и хорошо сформулированных задач. :chatgpt-content-reference{index="4"}

Например, нет большого смысла тратить Sol на задачу:

```text
найди все места использования UserRepository
```

или

```text
добавь nullable поле avatar_url в эти четыре DTO
```

Это отличный workload для Luna.

А задача:

```text
Спроектируй переход с session-based auth
на access + refresh tokens, не ломая существующие клиенты
```

уже естественно уходит Architect/Sol.

---

## Важный нюанс: это не жёсткий router

Вот здесь есть существенное отличие.

`description` + `AGENTS.md` дают **LLM-based routing**:

```text
main agent
   ↓
"какой агент подходит?"
   ↓
выбирает role
```

То есть поведение вероятностное.

Ты не задаёшь жёстко:

```python
if complexity > 7:
    model = sol
else:
    model = luna
```

а объясняешь оркестратору правила.

Поэтому я рекомендую делать `description` агентов **максимально функциональными**, а не вроде:

```toml
description = "A helpful coding agent."
```

Лучше:

```toml
description = """
Use for bounded implementation tasks where the architecture and
required changes are already understood. Do not use for architectural
decisions or broad repository exploration.
"""
```

Так routing становится значительно стабильнее.

---

# А если нужна настоящая детерминированная оркестрация

Тогда я бы уже не пытался целиком решить её через интерактивный Codex CLI.

10 сентября 2026 OpenAI выпустила **Agents API**, где тот же Codex harness можно использовать программно: harness управляет контекстом, сессиями и subagents, а твоя программа задаёт окружающий workflow. OpenAI сейчас рекомендует Agents API как основной вариант для новых агентных приложений; Codex SDK остаётся вариантом, когда harness должен работать на твоей инфраструктуре. :chatgpt-content-reference{index="5"}

Тогда можно построить уже настоящий pipeline:

```text
                ┌─────────────┐
                │ Orchestrator│
                │   Sol       │
                └──────┬──────┘
                       │
            classify + decompose
                       │
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
 Explorer Luna    Worker Luna     Architect Sol
       │               │               │
       └───────────────┼───────────────┘
                       ↓
                  Reviewer Sol
                       ↓
                  Test / verify
                       ↓
                     Done
```

И там уже твоя программа может решать:

```text
task.type == "exploration"
    → Luna

task.type == "implementation"
    → Luna

task.risk == "high"
    → Sol

task.type == "architecture"
    → Sol

changed_files > 10
    → spawn reviewer

frontend && backend
    → spawn two workers in parallel
```

Agents API прямо поддерживает независимые subagents с отдельным контекстом и параллельной работой. :chatgpt-content-reference{index="6"}

---

## Что я бы выбрал для твоего случая

Если речь именно про **ежедневную работу в Codex над репозиториями**, я бы пока не городил свой внешний orchestrator.

Использовал бы:

```text
GPT-6 Sol
   │
   ├─ architect → Sol
   ├─ reviewer  → Sol
   │
   ├─ explorer  → Luna
   ├─ worker    → Luna
   └─ tester    → Luna
```

плюс:

```text
.codex/config.toml
.codex/agents/*.toml
AGENTS.md
```

Это уже даёт именно то, что ты описал:

> **я ставлю одну задачу Codex, а он сам решает, какие части отдать каким моделям, без моего `/model`.**

А если позже захочется orchestration уровня **Claude Code teams / собственный Hermes-runtime / DAG задач / retries / evaluator → rework → reviewer**, тогда уже логично вынести orchestration в **Agents API или Codex SDK**. Официально OpenAI как раз разделяет эти варианты: Agents API — managed harness, Codex SDK — harness в твоём окружении, Responses API — когда агентный цикл хочешь полностью контролировать сам. :chatgpt-content-reference{index="7"}

Если хочешь, я могу следующим сообщением составить тебе **готовый production-like `.codex/` сетап из 5–7 агентов** с нормальным routing между GPT-6 Sol/Luna под full-stack разработку (frontend/backend/tests/review/research), который можно практически сразу положить в репозиторий.
