# infraege — Claude Code adapter

**Start here:** read [`AGENTS.md`](AGENTS.md). It is the source of truth for core rules, gates,
library lookup, git workflow, permission-denied handling, and the change lifecycle.

This file only lists Claude-specific command wrappers.

## Slash commands

| Command | When to use | Wraps playbook |
|---------|-------------|----------------|
| `/plan ["brief" \| path/to/draft.md] [--new\|--continue]` | Auto-select the next documented scope when omitted, or use a brief; refresh SPEC when needed and scaffold its feature branch | [docs/playbooks/plan.md](docs/playbooks/plan.md) |
| `/work [NN] [ID\|group]` | Agent implements Backlog items and runs one affected-area Critical Gate | [docs/playbooks/work.md](docs/playbooks/work.md) |
| `/work [NN] review [R#]` | Agent fixes unchecked Architect Review Notes | [docs/playbooks/work.md](docs/playbooks/work.md) |
| `/ship [NN] [--full\|--release]` | Check changes since work by default; `--full` is manual Full Gate; `--release` adds affected coverage and Release Gate | [docs/playbooks/ship.md](docs/playbooks/ship.md) |

Skill wrappers live in `.claude/skills/` and are intentionally thin.

## MCP

`Context7` is wired in `.mcp.json` at the project root and in
`plugins/sdd-workflow/.mcp.json` for Codex. Per `AGENTS.md § Library Documentation Lookup`, prefer
MCP documentation lookup when available.

For interactive browser checks, follow the Playwriter/profile rule in `AGENTS.md`
and [STACK's WSL connection procedure](docs/STACK.md#interactive-browser-connection-wsl)
before using a fallback browser driver.
