SHELL := /bin/sh

COMPOSE := docker compose --env-file /dev/null --project-name infraege-dev \
	-f infra/docker-compose.yml \
	-f infra/docker-compose.dev.yml

# Disposable local-only values. They are process-scoped Compose inputs, not secrets and not files.
# Explicit assignments also prevent an unrelated infra/.env from changing the developer stack.
LOCAL_ENV := POSTGRES_USER=infraege \
	POSTGRES_PASSWORD=infraege-local-only \
	POSTGRES_DB=infraege \
	APP_ENV=development \
	DEPLOY_SHA=development

WIREGUARD_TUNNEL := ./scripts/wireguard-tunnel.sh
DOCKER_LIFECYCLE := ./scripts/docker-dev-lifecycle.sh

.DEFAULT_GOAL := help

# Compose stops services in reverse dependency order (nginx, web, api, postgres), so a service
# that doesn't exit on SIGTERM pays this timeout once per service — up to 4x in the worst case.
# Kept low: local dev holds no in-flight traffic or unflushed state worth draining, and postgres
# durability comes from WAL, not a slow shutdown — so a stuck process should be force-killed
# quickly instead of stalling `make stop`/`make down`.
STOP_TIMEOUT ?= 10

.PHONY: help dev rebuild stop down restart logs ps config clean \
	tunnel-up tunnel-down tunnel-status \
	ops-open-beszel ops-open-umami \
	ops-status ops-config ops-install ops-update ops-rollback sre-management

help:
	@echo "infraege local Docker workflow"
	@echo ""
	@echo "  make dev      Start or resume the app and wait until it is healthy"
	@echo "  make rebuild  Rebuild app images, start, and wait until healthy"
	@echo "  make stop     Stop the app and keep containers for fast resume"
	@echo "  make down     Remove app containers/network (keeps PostgreSQL data)"
	@echo "  make restart  Restart the complete developer stack"
	@echo "  make logs     Follow logs from all services"
	@echo "  make ps       Show service and health status"
	@echo "  make config   Validate the fully rendered Compose configuration"
	@echo "  make clean    Remove regenerable local reports, build outputs, and caches"
	@echo "  make sre-management ACTION=status  Operate the dedicated sre-kit management VPS"
	@echo ""
	@echo "infraege private VPS access"
	@echo ""
	@echo "  make tunnel-up     Start and verify the WireGuard tunnel to the private VPS network"
	@echo "  make tunnel-down   Stop a tunnel started by this Makefile"
	@echo "  make tunnel-status Show interface, route, and handshake state"
	@echo ""
	@echo "infraege private-service shortcuts"
	@echo ""
	@echo "  make ops-open-beszel Open private Beszel UI in WSLg Chromium"
	@echo "  make ops-open-umami  Open private Umami UI in WSLg Chromium"
	@echo "  make ops-config ENV_FILE=... RELEASE=...  Validate the independent ops definition"
	@echo "  make ops-status                              Show installed ops status over SSH"
	@echo "  make ops-install ENV_FILE=... RELEASE=...   Install the first ops release"
	@echo "  make ops-update ENV_FILE=... RELEASE=...    Apply a new ops release"
	@echo "  make ops-rollback                            Restore the previous ops release"

dev:
	@STOP_TIMEOUT=$(STOP_TIMEOUT) $(DOCKER_LIFECYCLE) dev

rebuild:
	@STOP_TIMEOUT=$(STOP_TIMEOUT) $(DOCKER_LIFECYCLE) rebuild

stop:
	@STOP_TIMEOUT=$(STOP_TIMEOUT) $(DOCKER_LIFECYCLE) stop

down:
	@STOP_TIMEOUT=$(STOP_TIMEOUT) $(DOCKER_LIFECYCLE) down

restart:
	@STOP_TIMEOUT=$(STOP_TIMEOUT) $(DOCKER_LIFECYCLE) restart

logs:
	@$(LOCAL_ENV) $(COMPOSE) logs --follow --tail=100

ps:
	@$(LOCAL_ENV) $(COMPOSE) ps --all

config:
	@$(LOCAL_ENV) $(COMPOSE) config --quiet
	@echo "Compose configuration is valid."

clean:
	@rm -rf -- .lighthouseci .output .vinxi \
		apps/web/.output apps/web/.vinxi apps/web/dist apps/web/.eslintcache
	@find apps/api -type d \( -name __pycache__ -o -name .pytest_cache -o -name .ruff_cache \) \
		-prune -exec rm -rf -- {} +
	@echo "Regenerable local reports, build outputs, and caches removed."

tunnel-up:
	@$(WIREGUARD_TUNNEL) up

tunnel-down:
	@$(WIREGUARD_TUNNEL) down

tunnel-status:
	@$(WIREGUARD_TUNNEL) status

ops-open-beszel:
	@pnpm --filter web exec playwright open http://10.77.0.1:8090

ops-open-umami:
	@pnpm --filter web exec playwright open http://10.77.0.1:3001

ops-status:
	@./ops/opsctl status

ops-config:
	@test -n "$(ENV_FILE)" -a -n "$(RELEASE)" || \
		{ echo "ENV_FILE and RELEASE are required" >&2; exit 2; }
	@./ops/opsctl config --env-file "$(ENV_FILE)" --release "$(RELEASE)"

ops-install:
	@test -n "$(ENV_FILE)" -a -n "$(RELEASE)" || \
		{ echo "ENV_FILE and RELEASE are required" >&2; exit 2; }
	@./ops/opsctl install --env-file "$(ENV_FILE)" --release "$(RELEASE)"

ops-update:
	@test -n "$(ENV_FILE)" -a -n "$(RELEASE)" || \
		{ echo "ENV_FILE and RELEASE are required" >&2; exit 2; }
	@./ops/opsctl update --env-file "$(ENV_FILE)" --release "$(RELEASE)"

ops-rollback:
	@./ops/opsctl rollback

sre-management:
	@./scripts/management-sre-kit.sh "$(ACTION)" "$(RELEASE)"
