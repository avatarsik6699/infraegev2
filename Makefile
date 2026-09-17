SHELL := /bin/sh

COMPOSE := docker compose --env-file /dev/null --project-name infraege-dev \
	-f infra/docker-compose.yml \
	-f infra/docker-compose.dev.yml

# Disposable local-only values. They are process-scoped Compose inputs, not secrets and not files.
# Explicit assignments also prevent an unrelated infra/.env from changing the developer stack.
LOCAL_ENV := POSTGRES_USER=infraege \
	POSTGRES_PASSWORD=infraege-local-only \
	DB_RUNTIME_PASSWORD=infraege-dev-runtime-only \
	DB_IMPORT_PASSWORD=infraege-dev-import-only \
	DB_MIGRATION_PASSWORD=infraege-dev-migration-only \
	DB_BACKUP_PASSWORD=infraege-dev-backup-only \
	POSTGRES_DB=infraege \
	DB_ENV=dev DB_PROJECT=infraege-dev TASK_FILES_DIR=./task-files.local \
	APP_ENV=development \
	DEPLOY_SHA=development

DOCKER_LIFECYCLE := ./scripts/docker-dev-lifecycle.sh

.DEFAULT_GOAL := help

# Compose stops services in reverse dependency order (nginx, web, api, postgres), so a service
# that doesn't exit on SIGTERM pays this timeout once per service — up to 4x in the worst case.
# Kept low: local dev holds no in-flight traffic or unflushed state worth draining, and postgres
# durability comes from WAL, not a slow shutdown — so a stuck process should be force-killed
# quickly instead of stalling `make stop`/`make down`.
STOP_TIMEOUT ?= 10

.PHONY: help dev rebuild stop down restart logs ps config clean clean-check clean-dry-run

help:
	@echo "infraege local Docker workflow"
	@echo ""
	@echo "  make dev      Start/resume the app; rebuild automatically when image inputs changed"
	@echo "  make rebuild  Force-rebuild app images, start, and wait until healthy"
	@echo "  make stop     Stop the app and keep containers for fast resume"
	@echo "  make down     Remove app containers/network (keeps PostgreSQL data)"
	@echo "  make restart  Restart the complete developer stack"
	@echo "  make logs     Follow logs from all services"
	@echo "  make ps       Show service and health status"
	@echo "  make config   Validate the fully rendered Compose configuration"
	@echo "  make clean    Remove regenerable local reports, build outputs, and caches"
	@echo "  make clean-check    Fail if allowlisted local artifacts remain"
	@echo "  make clean-dry-run  Preview the exact local artifacts make clean removes"
	@echo "  make db-inventory DB_ENV=dev DB_PROJECT=infraege-dev  Read application DB metadata"
	@echo "  make db-backup DB_ENV=... DB_PROJECT=... ENV_FILE=...  Back up an explicit application DB"
	@echo "  make db-restore-check DB_ENV=restore DB_PROJECT=infraege-restore  Verify a disposable restore"
	@echo "  make db-export DB_ENV=prod DB_PROJECT=infraege DESTINATION=...  Export encrypted PC copy"

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
	@./scripts/clean-local-artifacts.sh --apply

clean-dry-run:
	@./scripts/clean-local-artifacts.sh --dry-run

clean-check:
	@./scripts/clean-local-artifacts.sh --check

.PHONY: db-inventory db-backup db-restore-check db-export
.PHONY: practice-bootstrap
practice-bootstrap:
	@python3 scripts/practice-local.py import content/practice-bank

db-inventory:
	@bash scripts/db-inventory.sh "$(DB_ENV)" "$(DB_PROJECT)"

db-backup:
	@test -n "$(ENV_FILE)" || { echo 'ENV_FILE is required' >&2; exit 64; }
	@DB_ENV="$(DB_ENV)" DB_PROJECT="$(DB_PROJECT)" bash scripts/backup.sh "$(ENV_FILE)"

db-restore-check:
	@DB_ENV="$(DB_ENV)" DB_PROJECT="$(DB_PROJECT)" bash scripts/restore-check.sh

db-export:
	@DB_ENV="$(DB_ENV)" DB_PROJECT="$(DB_PROJECT)" bash scripts/db-export.sh "$(DESTINATION)"
