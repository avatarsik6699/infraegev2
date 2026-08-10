# Operations dashboard

`apps/ops` is a local-first, read-only application. It is not deployed on the production VPS. Its
Node BFF binds only `127.0.0.1`, reads a versioned project list, and fetches each source
independently so one outage does not blank the screen.

## First-time local setup

The standard WSL paths are:

```text
~/.config/infraege/production/infraege-wsl.conf  # existing WireGuard config, mode 600
~/.config/infraege/ops/projects.json             # source IDs and env variable names, mode 600
~/.config/infraege/ops/ops.env                   # source credentials, mode 600
~/.local/state/infraege/ops/                     # generated PID and logs
```

Runtime state and credentials stay outside the repository. `ops.env` is sourced as an
operator-owned shell environment file, so it must remain mode `600` and contain only assignments.

1. Install `wireguard-tools`, then start only the narrow tunnel. `sudo` prompts for the local WSL
   password; the config routes only `10.77.0.0/24`, not general internet traffic.

   ```bash
   sudo apt install wireguard-tools
   make ops-tunnel-up
   make ops-status
   ```

   A successful start reports a recent handshake and reaches the private Beszel endpoint. In WSL
   mirrored networking an active Amnezia full-tunnel remains the default route, while the more
   specific `10.77.0.0/24` route belongs to `infraege-wsl`.

2. Over WireGuard, finish the Umami and Beszel account/system steps in
   [`production-onboarding.md`](production-onboarding.md). None of their credentials come from the
   VPS order confirmation. Separate least-privilege dashboard accounts remain the recommended
   target. The current single-operator setup temporarily uses the existing administrators; rotate
   Umami's default password and introduce limited accounts before hosting ops remotely, sharing
   the workstation or broadening private service access.

3. Create protected local input templates and replace the remaining source ID and credential
   placeholders:

   ```bash
   make ops-init
   $EDITOR "$HOME/.config/infraege/ops/projects.json"
   $EDITOR "$HOME/.config/infraege/ops/ops.env"
   ```

   `ops-init` does not overwrite existing files and fills the saved public Umami website UUID when
   available. `projects.json` still needs the real Beszel `systemId`. Its direct WireGuard
   Umami URL is `http://10.77.0.1:3001` without the public Nginx `/stats` prefix. Values ending in `Env`
   are environment variable names, never credentials. Keep `umami.timezone` as `Europe/Moscow` so
   analytics buckets match the operator's day.

   After creating the Beszel universal token and system public key, activate only its production
   agent without placing either value in shell history:

   ```bash
   make ops-configure-beszel-agent
   ```

   The helper uses the pinned deploy SSH identity, replaces only the two Beszel variables,
   recreates only `beszel-agent`, and restores the previous protected env if startup fails.

   `ops.env` contains only these assignments with locally chosen values:

   ```bash
   INFRAEGE_BESZEL_EMAIL=...
   INFRAEGE_BESZEL_PASSWORD=...
   INFRAEGE_UMAMI_USERNAME=...
   INFRAEGE_UMAMI_PASSWORD=...
   INFRAEGE_OPS_SSH_KEY=/absolute/path/to/ops_reader_ed25519
   INFRAEGE_OPS_SSH_KNOWN_HOSTS=/absolute/path/to/pinned/known_hosts
   ```

   The fail2ban connection still targets the private `10.77.0.1` address. Its `hostKeyAlias`
   selects the already pinned public VPS entry from `known_hosts`, so the same server key is
   verified without trusting a new key for the WireGuard address. Keep both values aligned when
   the VPS or its SSH host key changes.

## Daily lifecycle

Start everything with one command:

   ```bash
   make ops-up
   ```

Open `http://127.0.0.1:8787`. Red badges mean a source is unavailable; the rest of the snapshot
remains usable. Source messages are sanitized by the BFF. The lifecycle commands are:

```bash
make ops-status
make ops-logs       # follow; Ctrl-C stops following, not the dashboard
make ops-down       # stop dashboard and the tunnel started by make ops-up
```

`HISTORY` (`1h`, `24h`, `7d`, `30d`) controls the graph window, not how often data is fetched.
`REFRESH` controls the local browser cadence independently: near-live `15s` is the default, with
`30s`, `60s` and `PAUSE` alternatives plus a manual refresh button. Polling stops while the tab is
hidden and resumes immediately when it becomes visible.

The BFF prevents overlapping work and coalesces concurrent tabs. It refreshes availability after
10 seconds, sanitized Umami realtime aggregates after 15 seconds, journald/fail2ban after 30
seconds, and Beszel plus historical Umami data after 60 seconds. The Umami realtime response is
reduced to visitor/view/event totals for its 30-minute window; raw events, session identifiers and
credentials never enter the browser. Shortening the browser interval below 15 seconds would not
increase Beszel's one-minute history resolution and would mainly increase VPS, database and SSH
load.

`ops-down` never stops a WireGuard interface that was already active before the lifecycle script
started. The dashboard always binds to `127.0.0.1`; startup fails if protected files have the wrong
owner/mode, placeholders remain, the route/handshake is absent, or the private endpoint cannot be
reached.

## Expected evidence

- `make ops-status` reports the dashboard running, route OK, and a recent handshake when sudo's
  credential is still cached.
- `curl -fsS http://127.0.0.1:8787/api/projects` returns the configured project list.
- The dashboard source strip shows availability, Beszel, Umami, journal and fail2ban independently
  as `fresh`, `stale` or `unavailable`.
- EDGE shows `up` and the same short SHA as `https://infraege.ru/health/ready`.
- CPU, RAM, disk and containers come from Beszel; visits and the learning funnel come from Umami;
  recent errors and bans come from journald/fail2ban.
- Container RAM is Beszel's binary-megabyte value and is displayed as MiB, switching to GiB at
  1024 MiB. It is current usage, not an image or volume size.
- A real browser visit loads `/stats/script.js`; tracker events post only to `/stats/api/send`.
  Historical Umami totals may remain cached for up to 60 seconds, while the sanitized 30-minute
  realtime totals refresh after 15 seconds.

Sources are: public readiness, Beszel host/container data, Umami analytics, systemd journal gateway
and the forced-command `ops-reader` SSH account for fail2ban. Beszel and Umami admin ports plus the
journal gateway are bound to WireGuard. Docker access is mediated by a read-only socket proxy;
never mount `/var/run/docker.sock` into the dashboard or expose these ports publicly.

Before moving the dashboard to a separate VPS, add authentication and TLS at its front door, retain
the loopback BFF binding, and add projects only through the same config contract.

## Recovery

Start with `make ops-status`, then inspect `make ops-logs`. If the private route or handshake is
missing, run `make ops-tunnel-up` in an interactive WSL terminal so `sudo` can prompt there, then
retry `make ops-up`. A sudo timestamp may be scoped to one terminal and therefore may not carry to
another shell or automation PTY.

Use `make ops-down` for a graceful local stop, then `make ops-up` for a clean restart. It removes
the dashboard PID/log runtime state it owns and lowers only the WireGuard interface it started; it
does not alter protected configuration. If a single source remains red after connectivity returns,
follow its sanitized message and the matching entry in `docs/KNOWN_GOTCHAS.md` rather than exposing
an admin port publicly.
