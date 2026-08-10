# Operations dashboard

`apps/ops` is a local-first, read-only application. It is not deployed on the production VPS. Its
Node BFF binds only `127.0.0.1`, reads a versioned project list, and fetches each source
independently so one outage does not blank the screen.

1. Establish WireGuard connectivity to the production VPS.
   Generate and place the source credentials using
   [`production-onboarding.md`](production-onboarding.md); none of them come from the VPS order
   confirmation.
2. Copy `apps/ops/config/projects.example.json` to an untracked path outside the repository and
   replace source IDs. Keep credentials out of JSON; values ending in `Env` name environment
   variables. The optional `umami.timezone` must be an IANA name and defaults to `UTC`; use
   `Europe/Moscow` for the current infraege project so analytics buckets match the operator's day.
3. Set the four Beszel/Umami credential variables and the read-only SSH key path variable shown in
   the example, then run:

   ```bash
   pnpm --filter ops build
   OPS_CONFIG_PATH=/absolute/path/projects.json pnpm --filter ops start
   ```

4. Open `http://127.0.0.1:8787`. Red badges mean a source is unavailable; the rest of the snapshot
   remains usable. Source messages are sanitized by the BFF.

Sources are: public readiness, Beszel host/container data, Umami analytics, systemd journal gateway
and the forced-command `ops-reader` SSH account for fail2ban. Beszel and Umami admin ports plus the
journal gateway are bound to WireGuard. Docker access is mediated by a read-only socket proxy;
never mount `/var/run/docker.sock` into the dashboard or expose these ports publicly.

Before moving the dashboard to a separate VPS, add authentication and TLS at its front door, retain
the loopback BFF binding, and add projects only through the same config contract.
