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
from routes.plaid import router as plaid_router
from routes.settings import router as settings_router


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
        
        # Log Plaid configuration status
        import os
        plaid_env = os.getenv('PLAID_ENV', 'not set')
        plaid_client_id = os.getenv('PLAID_CLIENT_ID', 'not set')
        plaid_secret = os.getenv('PLAID_SECRET', 'not set')
        
        logger.info(f"Plaid Environment: {plaid_env}")
        logger.info(f"Plaid Client ID: {'configured' if plaid_client_id != 'not set' else 'not configured'}")
        logger.info(f"Plaid Secret: {'configured' if plaid_secret != 'not set' else 'not configured'}")
        
        if plaid_client_id != 'not set' and plaid_secret != 'not set':
            logger.info("Plaid integration: READY")
        else:
            logger.warning("Plaid integration: NOT CONFIGURED - Set PLAID_CLIENT_ID and PLAID_SECRET environment variables")
        
        # Log Supabase configuration status
        supabase_url = os.getenv('SUPABASE_URL', 'not set')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY', 'not set')
        
        logger.info(f"Supabase URL: {'configured' if supabase_url != 'not set' else 'not configured'}")
        logger.info(f"Supabase Service Role Key: {'configured' if supabase_key != 'not set' else 'not configured'}")
        
        if supabase_url != 'not set' and supabase_key != 'not set':
            logger.info("Supabase storage: READY")
        else:
            logger.warning("Supabase storage: NOT CONFIGURED - Using in-memory storage. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables")
            
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
app.include_router(transactions_router, prefix=f"{settings.API_V1_PREFIX}/transactions", tags=["transactions"])
app.include_router(health_router, tags=["health"])
app.include_router(plaid_router, prefix=settings.API_V1_PREFIX, tags=["plaid"])
app.include_router(settings_router, prefix=settings.API_V1_PREFIX, tags=["settings"])


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
            "webhooks": f"{settings.API_V1_PREFIX}/webhook",
            "plaid": {
                "create_link_token": f"{settings.API_V1_PREFIX}/create_link_token",
                "exchange_public_token": f"{settings.API_V1_PREFIX}/exchange_public_token",
                "balance": f"{settings.API_V1_PREFIX}/balance",
                "health": f"{settings.API_V1_PREFIX}/health"
            }
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
