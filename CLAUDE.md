# infraege — Claude Code adapter

**Start here:** read [`AGENTS.md`](AGENTS.md). It is the source of truth for core rules, gates,
library lookup, git workflow, permission-denied handling, and the change lifecycle.

This file only lists Claude-specific command wrappers.

## Slash commands

| Command | When to use | Wraps playbook |
|---------|-------------|----------------|
| `/plan ["brief" \| path/to/draft.md] [--new\|--continue]` | Auto-select the next documented scope when omitted, or use a brief; refresh SPEC when needed and scaffold its feature branch | [docs/playbooks/plan.md](docs/playbooks/plan.md) |
| `/work [NN] [ID\|group]` | Agent implements Backlog items and runs one affected-area Critical Gate | [docs/playbooks/work.md](docs/playbooks/work.md) |
| `/ship [NN] [--full\|--release]` | Check changes since work by default; `--full` is manual Full Gate; `--release` adds affected coverage and Release Gate | [docs/playbooks/ship.md](docs/playbooks/ship.md) |

Skill wrappers live in `.claude/skills/` and are intentionally thin.

## MCP

`.mcp.json` declares Context7 as the `context7-mcp` command; it connects only when that binary is
on `PATH` (Codex reads `.codex/config.toml`). When the MCP server is unavailable, use the `ctx7` CLI
per `AGENTS.md § Library Documentation Lookup`.

For interactive browser checks, follow the Playwriter/profile rule in `AGENTS.md`
and [STACK's WSL connection procedure](docs/STACK.md#interactive-browser-connection-wsl)
before using a fallback browser driver.
