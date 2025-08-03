from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import JSONResponse
from models import Organization, OrganizationsListResponse, ErrorResponse
from services.pledge_client import pledge_client
import requests
import logging
from typing import Optional

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/organizations/{organization_id}",
    response_model=Organization,
    summary="Get organization by ID",
    description="Get detailed information about a specific nonprofit organization.",
    responses={
        200: {"model": Organization, "description": "Organization found"},
        404: {"model": ErrorResponse, "description": "Organization not found"},
        401: {"model": ErrorResponse, "description": "Unauthorized - invalid API key"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def get_organization_by_id(organization_id: str):
    """
    Get detailed information about a specific nonprofit organization by ID.
    """
    try:
        logger.info(f"Fetching organization details for ID: {organization_id}")
        
        # Call Pledge.to API
        response_data = await pledge_client.get_organization_by_id(organization_id)
        
        logger.info(f"Successfully fetched organization: {response_data.get('name', 'unknown')}")
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=response_data
        )
        
    except requests.HTTPError as e:
        logger.error(f"Pledge.to API error: {e.response.status_code} - {e.response.text}")
        
        if e.response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Organization with ID {organization_id} not found"
            )
        elif e.response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: Invalid API key"
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
            detail="Failed to connect to organizations service"
        )
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get(
    "/organizations",
    response_model=OrganizationsListResponse,
    summary="List organizations",
    description="Get a list of nonprofit organizations with optional filtering.",
    responses={
        200: {"model": OrganizationsListResponse, "description": "Organizations list retrieved"},
        401: {"model": ErrorResponse, "description": "Unauthorized - invalid API key"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def list_organizations(
    page: Optional[int] = Query(1, ge=1, description="Page number"),
    per_page: Optional[int] = Query(20, ge=1, le=100, description="Number of organizations per page"),
    search: Optional[str] = Query(None, description="Search term for organization name or description"),
    cause_id: Optional[int] = Query(None, description="Filter by cause ID")
):
    """
    Get a paginated list of nonprofit organizations with optional filtering.
    """
    try:
        logger.info(f"Fetching organizations list - page: {page}, per_page: {per_page}")
        
        # Build query parameters
        params = {
            "page": page,
            "per_page": per_page
        }
        if search:
            params["search"] = search
        if cause_id:
            params["cause_id"] = cause_id
        
        # Call Pledge.to API
        response_data = await pledge_client.list_organizations(params)
        
        logger.info(f"Successfully fetched organizations list")
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=response_data
        )
        
    except requests.HTTPError as e:
        logger.error(f"Pledge.to API error: {e.response.status_code} - {e.response.text}")
        
        if e.response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: Invalid API key"
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
            detail="Failed to connect to organizations service"
        )
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
