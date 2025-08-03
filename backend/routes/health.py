from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from services.pledge_client import pledge_client
from config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/health",
    summary="Service health check",
    description="Check the health of the API service and its connection to external services"
)
async def health_check():
    """Comprehensive health check endpoint"""
    try:
        # Check if Pledge.to API is accessible
        api_healthy = await pledge_client.health_check()
        
        health_status = {
            "status": "healthy" if api_healthy else "degraded",
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "pledge_api": {
                "status": "connected" if api_healthy else "disconnected",
                "donation_endpoint": settings.donation_base_url,
                "organization_endpoint": settings.organization_base_url
            },
            "configuration": {
                "sandbox_mode": settings.USE_SANDBOX_FOR_DONATIONS,
                "debug_mode": settings.DEBUG,
                "api_keys_configured": {
                    "production": bool(settings.PLEDGE_TO_API_KEY),
                    "sandbox": bool(settings.PLEDGE_TO_SANDBOX_API_KEY)
                }
            }
        }
        
        status_code = status.HTTP_200_OK if api_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
        
        return JSONResponse(
            status_code=status_code,
            content=health_status
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "service": settings.PROJECT_NAME,
                "error": str(e)
            }
        )


@router.get(
    "/ping",
    summary="Simple ping check",
    description="Simple endpoint to check if the service is running"
)
async def ping():
    """Simple ping endpoint"""
    return {"status": "ok", "message": "pong"}
