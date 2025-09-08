from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .api import routes_auth, routes_accounts, routes_transactions


def create_app() -> FastAPI:
    # Create and configure the FastAPI application.
    settings = get_settings()
    app = FastAPI(title="ATM API")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.cors_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(routes_auth.router)
    app.include_router(routes_accounts.router)
    app.include_router(routes_transactions.router)
    return app


app = create_app()