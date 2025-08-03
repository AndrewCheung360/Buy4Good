from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging
from config import settings

# Import route modules
from routes.donations import router as donations_router
from routes.organizations import router as organizations_router
from routes.transactions import router as transactions_router
from routes.health import router as health_router


# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Buy4Good API")
    try:
        settings.validate_settings()
        logger.info("Settings validated successfully")
        logger.info(f"Donation API URL: {settings.donation_base_url}")
        logger.info(f"Organization API URL: {settings.organization_base_url}")
        logger.info(f"Sandbox mode for donations: {settings.USE_SANDBOX_FOR_DONATIONS}")
    except ValueError as e:
        logger.error(f"Settings validation failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Buy4Good API")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API for donations, transactions, and affiliate network integration via Pledge.to",
    lifespan=lifespan,
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
app.include_router(donations_router, prefix=settings.API_V1_PREFIX, tags=["donations"])
app.include_router(organizations_router, prefix=settings.API_V1_PREFIX, tags=["organizations"])
app.include_router(transactions_router, prefix=settings.API_V1_PREFIX, tags=["transactions"])
app.include_router(health_router, tags=["health"])


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation error",
            "detail": exc.errors(),
            "status_code": 422
        }
    )


@app.get("/", tags=["root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Buy4Good API",
        "version": settings.VERSION,
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        },
        "endpoints": {
            "health": "/health",
            "donations": f"{settings.API_V1_PREFIX}/donations",
            "organizations": f"{settings.API_V1_PREFIX}/organizations",
            "transactions": f"{settings.API_V1_PREFIX}/simulate-transaction",
            "webhooks": f"{settings.API_V1_PREFIX}/webhook"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if not settings.DEBUG else "debug"
    )
