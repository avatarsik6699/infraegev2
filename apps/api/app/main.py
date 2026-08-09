from fastapi import FastAPI

from app.middleware.error_alert import ErrorAlertMiddleware
from app.routers import health, tasks

app = FastAPI(title="infraege API")

app.add_middleware(ErrorAlertMiddleware)

app.include_router(health.router)
app.include_router(tasks.router)
