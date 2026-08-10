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
	SITE_URL=http://localhost:8080 \
	DEPLOY_SHA=development

OPS_LOCAL := ./scripts/ops-local.sh

.DEFAULT_GOAL := help

STOP_TIMEOUT ?= 30

.PHONY: help dev stop down restart logs ps config \
	ops-init ops-up ops-down ops-status ops-logs ops-tunnel-up ops-tunnel-down \
	ops-open-beszel ops-open-umami ops-configure-beszel-agent

help:
	@echo "infraege local Docker workflow"
	@echo ""
	@echo "  make dev      Build, start, and wait until the app is healthy"
	@echo "  make stop     Gracefully stop the app (keeps PostgreSQL data)"
	@echo "  make down     Alias for make stop"
	@echo "  make restart  Restart the complete developer stack"
	@echo "  make logs     Follow logs from all services"
	@echo "  make ps       Show service and health status"
	@echo "  make config   Validate the fully rendered Compose configuration"
	@echo ""
	@echo "infraege local operations dashboard"
	@echo ""
	@echo "  make ops-init        Create protected local config templates"
	@echo "  make ops-up          Start WireGuard and the loopback ops dashboard"
	@echo "  make ops-status      Show dashboard, route, and handshake status"
	@echo "  make ops-logs        Follow dashboard logs"
	@echo "  make ops-down        Stop dashboard and its managed WireGuard tunnel"
	@echo "  make ops-tunnel-up   Start only WireGuard for first-time source setup"
	@echo "  make ops-tunnel-down Stop only the managed WireGuard tunnel"
	@echo "  make ops-open-beszel Open private Beszel UI in WSLg Chromium"
	@echo "  make ops-open-umami  Open private Umami UI in WSLg Chromium"
	@echo "  make ops-configure-beszel-agent  Securely activate the production Beszel agent"

dev:
	@docker info >/dev/null 2>&1 || { echo "Docker is not running." >&2; exit 1; }
	@$(LOCAL_ENV) $(COMPOSE) up --build --wait --wait-timeout 180
	@echo ""
	@echo "infraege is ready: http://localhost:8080/"
	@echo "Published topic: http://localhost:8080/theory/zadanie-1-graphs-and-tables"

stop:
	@docker info >/dev/null 2>&1 || { echo "Docker is not running." >&2; exit 1; }
	@echo "Stopping infraege gracefully (timeout: $(STOP_TIMEOUT)s per service)..."
	@$(LOCAL_ENV) $(COMPOSE) down --timeout $(STOP_TIMEOUT) --remove-orphans
	@echo "infraege stopped. PostgreSQL data was preserved."

down: stop

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

ops-init:
	@$(OPS_LOCAL) init

ops-up:
	@$(OPS_LOCAL) up

ops-status:
	@$(OPS_LOCAL) status

ops-logs:
	@$(OPS_LOCAL) logs

ops-down:
	@$(OPS_LOCAL) down

ops-tunnel-up:
	@$(OPS_LOCAL) tunnel-up

ops-tunnel-down:
	@$(OPS_LOCAL) tunnel-down

ops-open-beszel:
	@pnpm --filter web exec playwright open http://10.77.0.1:8090

ops-open-umami:
	@pnpm --filter web exec playwright open http://10.77.0.1:3001

ops-configure-beszel-agent:
	@./scripts/configure-beszel-agent.sh
