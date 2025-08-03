from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from models import DonationRequest, DonationResponse, ErrorResponse
from services.pledge_client import pledge_client
import requests
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/donations",
    response_model=DonationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a donation",
    description="Create a donation to a nonprofit organization through Pledge.to API (using sandbox).",
    responses={
        201: {"model": DonationResponse, "description": "Donation created successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request data"},
        401: {"model": ErrorResponse, "description": "Unauthorized - invalid API key"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def create_donation(donation_request: DonationRequest):
    """
    Create a donation to a nonprofit organization.
    
    This endpoint forwards the donation request to the Pledge.to API sandbox
    and returns the response.
    """
    try:
        logger.info(f"Creating donation for {donation_request.email} to organization {donation_request.organization_id}")
        
        # Call Pledge.to API (sandbox for donations)
        response_data = await pledge_client.create_donation(donation_request)
        
        logger.info(f"Donation created successfully with ID: {response_data.get('id', 'unknown')}")
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=response_data
        )
        
    except requests.HTTPError as e:
        logger.error(f"Pledge.to API error: {e.response.status_code} - {e.response.text}")
        
        # Handle different HTTP status codes from Pledge.to API
        if e.response.status_code == 400:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid request: {e.response.text}"
            )
        elif e.response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: Invalid API key"
            )
        elif e.response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        elif e.response.status_code == 422:
            # Parse validation errors from response
            try:
                error_detail = e.response.json()
                logger.error(f"Validation error details: {error_detail}")
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Validation error: {error_detail}"
                )
            except:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Validation error: {e.response.text}"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"External API error: {e.response.status_code}"
            )
            
    except requests.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to donation service"
        )
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
