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

.DEFAULT_GOAL := help

STOP_TIMEOUT ?= 30

.PHONY: help dev rebuild stop down restart logs ps config clean \
	tunnel-up tunnel-down tunnel-status \
	ops-open-beszel ops-open-umami ops-configure-beszel-agent \
	ops-repair-beszel-env

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
	@echo "  make ops-configure-beszel-agent  Securely activate the production Beszel agent"
	@echo "  make ops-repair-beszel-env       Normalize the protected Beszel key assignment"

dev:
	@docker info >/dev/null 2>&1 || { echo "Docker is not running." >&2; exit 1; }
	@$(LOCAL_ENV) $(COMPOSE) up --wait --wait-timeout 180
	@echo ""
	@echo "infraege is ready: http://localhost:8080/"
	@echo "UI foundation: http://localhost:8080/"

rebuild:
	@docker info >/dev/null 2>&1 || { echo "Docker is not running." >&2; exit 1; }
	@$(LOCAL_ENV) $(COMPOSE) up --build --wait --wait-timeout 180
	@echo ""
	@echo "infraege was rebuilt and is ready: http://localhost:8080/"

stop:
	@docker info >/dev/null 2>&1 || { echo "Docker is not running." >&2; exit 1; }
	@echo "Stopping infraege gracefully (timeout: $(STOP_TIMEOUT)s per service)..."
	@$(LOCAL_ENV) $(COMPOSE) stop --timeout $(STOP_TIMEOUT)
	@echo "infraege stopped. Containers and PostgreSQL data were preserved for fast resume."

down:
	@docker info >/dev/null 2>&1 || { echo "Docker is not running." >&2; exit 1; }
	@echo "Removing infraege containers and network (timeout: $(STOP_TIMEOUT)s per service)..."
	@$(LOCAL_ENV) $(COMPOSE) down --timeout $(STOP_TIMEOUT) --remove-orphans
	@echo "infraege containers and network removed. PostgreSQL data was preserved."

restart:
	@$(MAKE) stop
	@$(MAKE) dev

logs:
	@$(LOCAL_ENV) $(COMPOSE) logs --follow --tail=100

ps:
	@$(LOCAL_ENV) $(COMPOSE) ps

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

ops-configure-beszel-agent:
	@./scripts/configure-beszel-agent.sh

ops-repair-beszel-env:
	@./scripts/repair-beszel-env.sh --apply
