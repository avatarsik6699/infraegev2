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
	TELEGRAM_BOT_TOKEN= \
	TELEGRAM_CHAT_ID=

.DEFAULT_GOAL := help

STOP_TIMEOUT ?= 30

.PHONY: help dev stop down restart logs ps config

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
