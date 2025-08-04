from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest
from plaid.api import plaid_api
import os
import logging
from config import settings
from services.supabase_client import supabase_service

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models for request/response
class CreateLinkTokenRequest(BaseModel):
    address: Optional[str] = None
    user_id: Optional[str] = None

class ExchangeTokenRequest(BaseModel):
    public_token: str
    user_id: str

class BalanceRequest(BaseModel):
    user_id: str

# Plaid client configuration
def get_plaid_client():
    """Create and return a configured Plaid client"""
    configuration = plaid.Configuration(
        host=plaid.Environment.Sandbox if os.getenv('PLAID_ENV') == 'sandbox' else plaid.Environment.Production,
        api_key={
            'clientId': os.getenv('PLAID_CLIENT_ID'),
            'secret': os.getenv('PLAID_SECRET'),
        }
    )
    
    api_client = plaid.ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)

# Fallback in-memory storage (used only if Supabase is not configured)
user_access_tokens = {}

async def get_user_access_token(user_id: str) -> Optional[str]:
    """Get access token for a specific user"""
    # Try Supabase first, fall back to in-memory
    supabase_token = await supabase_service.get_access_token(user_id)
    if supabase_token:
        return supabase_token
    
    # Fallback to in-memory storage
    return user_access_tokens.get(user_id)

async def store_user_access_token(user_id: str, access_token: str):
    """Store access token for a specific user"""
    # Try Supabase first, fall back to in-memory
    success = await supabase_service.store_access_token(user_id, access_token)
    if not success:
        # Fallback to in-memory storage
        user_access_tokens[user_id] = access_token
        logger.warning(f"Stored access token in memory for user: {user_id}")

@router.post(
    "/create_link_token",
    summary="Create Plaid Link Token",
    description="Creates a Link token for Plaid Link integration"
)
async def create_link_token(request: CreateLinkTokenRequest, req: Request):
    """Creates a Link token and returns it"""
    try:
        client = get_plaid_client()
        user_id = request.user_id or f"user_{req.client.host}"
        
        # Create user object
        user = LinkTokenCreateRequestUser(client_user_id=user_id)
        
        # Base payload
        payload = LinkTokenCreateRequest(
            user=user,
            client_name="Buy4Good - Plaid Integration",
            language="en",
            products=[Products("auth"), Products("transactions")],
            country_codes=[CountryCode("US")]
        )
        
        # Add platform-specific configurations
        if request.address == "localhost":
            # iOS configuration
            redirect_uri = os.getenv('PLAID_SANDBOX_REDIRECT_URI')
            if redirect_uri:
                payload.redirect_uri = redirect_uri
        else:
            # Android configuration
            android_package = os.getenv('PLAID_ANDROID_PACKAGE_NAME')
            if android_package:
                payload.android_package_name = android_package
        
        # Create the link token
        response = client.link_token_create(payload)
        
        logger.info(f"Link token created successfully for user: {user_id}")
        return response.to_dict()
        
    except plaid.ApiException as e:
        logger.error(f"Plaid API error creating link token: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Plaid API error: {str(e)}")
    except Exception as e:
        logger.error(f"Error creating link token: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create link token: {str(e)}")

@router.post(
    "/exchange_public_token",
    summary="Exchange Public Token",
    description="Exchanges the public token from Plaid Link for an access token"
)
async def exchange_public_token(request: ExchangeTokenRequest, req: Request):
    """Exchanges the public token from Plaid Link for an access token"""
    try:
        client = get_plaid_client()
        
        # Exchange the public token for an access token
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=request.public_token
        )
        
        response = client.item_public_token_exchange(exchange_request)
        access_token = response['access_token']
        
        # Store access token for the specific user
        await store_user_access_token(request.user_id, access_token)
        
        logger.info(f"Public token exchanged successfully for user: {request.user_id}")
        return {"success": True}
        
    except plaid.ApiException as e:
        logger.error(f"Plaid API error exchanging public token: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Plaid API error: {str(e)}")
    except Exception as e:
        logger.error(f"Error exchanging public token: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to exchange public token: {str(e)}")

@router.post(
    "/balance",
    summary="Get Account Balance",
    description="Fetches balance data using the Plaid API"
)
async def get_balance(request: BalanceRequest, req: Request):
    """Fetches balance data using the Plaid API"""
    try:
        client = get_plaid_client()
        
        # Get access token for the specific user
        access_token = await get_user_access_token(request.user_id)
        
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token available for this user")
        
        # Get account balances
        balance_request = AccountsBalanceGetRequest(access_token=access_token)
        response = client.accounts_balance_get(balance_request)
        
        logger.info(f"Balance retrieved successfully for user: {request.user_id}")
        return {
            "Balance": response.to_dict()
        }
        
    except plaid.ApiException as e:
        logger.error(f"Plaid API error getting balance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Plaid API error: {str(e)}")
    except Exception as e:
        logger.error(f"Error getting balance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get balance: {str(e)}")

@router.delete(
    "/delete_token/{user_id}",
    summary="Delete Plaid Access Token",
    description="Delete the stored access token for a user"
)
async def delete_access_token(user_id: str):
    """Delete access token for a specific user"""
    try:
        success = await supabase_service.delete_access_token(user_id)
        if success:
            return {"success": True, "message": f"Access token deleted for user: {user_id}"}
        else:
            raise HTTPException(status_code=404, detail="No access token found for this user")
            
    except Exception as e:
        logger.error(f"Error deleting access token: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting access token: {e}")

@router.get(
    "/total_donation/{user_id}",
    summary="Get User Total Donation Amount",
    description="Get the total donation amount for a user"
)
async def get_total_donation(user_id: str):
    """Get total donation amount for a specific user"""
    try:
        total_donation = await supabase_service.get_user_total_donation(user_id)
        return {
            "success": True,
            "total_donation_amount": total_donation,
            "formatted_amount": f"${total_donation:.2f}"
        }
        
    except Exception as e:
        logger.error(f"Error getting total donation amount: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting total donation amount: {e}")

@router.get(
    "/recent_donations/{user_id}",
    summary="Get User Recent Donations",
    description="Get recent donations for a user"
)
async def get_recent_donations(user_id: str, limit: int = 10):
    """Get recent donations for a specific user"""
    try:
        donations = await supabase_service.get_recent_donations(user_id, limit)
        return {
            "success": True,
            "donations": donations
        }
        
    except Exception as e:
        logger.error(f"Error getting recent donations: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting recent donations: {e}")

@router.get(
    "/check_connection/{user_id}",
    summary="Check if user has connected Plaid",
    description="Check if a user has already connected their bank account"
)
async def check_plaid_connection(user_id: str):
    """Check if user has a stored access token"""
    try:
        access_token = await get_user_access_token(user_id)
        
        if access_token:
            return {
                "connected": True,
                "message": "User has connected bank account"
            }
        else:
            return {
                "connected": False,
                "message": "User has not connected bank account"
            }
            
    except Exception as e:
        logger.error(f"Error checking Plaid connection for user {user_id}: {str(e)}")
        return {
            "connected": False,
            "message": "Error checking connection status"
        }

@router.get(
    "/health",
    summary="Plaid Service Health Check",
    description="Check if Plaid service is properly configured"
)
async def plaid_health_check():
    """Check Plaid service health"""
    try:
        # Check if required environment variables are set
        required_vars = ['PLAID_CLIENT_ID', 'PLAID_SECRET', 'PLAID_ENV']
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        
        if missing_vars:
            return JSONResponse(
                status_code=503,
                content={
                    "status": "unhealthy",
                    "error": f"Missing required environment variables: {missing_vars}",
                    "service": "plaid"
                }
            )
        
        # Test Plaid client creation
        client = get_plaid_client()
        
        return {
            "status": "healthy",
            "service": "plaid",
            "configuration": {
                "environment": os.getenv('PLAID_ENV'),
                "client_id_configured": bool(os.getenv('PLAID_CLIENT_ID')),
                "secret_configured": bool(os.getenv('PLAID_SECRET')),
                "redirect_uri_configured": bool(os.getenv('PLAID_SANDBOX_REDIRECT_URI')),
                "android_package_configured": bool(os.getenv('PLAID_ANDROID_PACKAGE_NAME'))
            }
        }
        
    except Exception as e:
        logger.error(f"Plaid health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "plaid",
                "error": str(e)
            }
        ) 