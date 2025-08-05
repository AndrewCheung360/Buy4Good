import os
import logging
import json
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import plaid
from plaid.api import plaid_api
from services.supabase_client import supabase_service
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()

# Pydantic models
class GetTransactionsRequest(BaseModel):
    user_id: str
    start_date: str
    end_date: str
    account_ids: Optional[List[str]] = None

class CreateSandboxTransactionRequest(BaseModel):
    user_id: str
    amount: float
    merchant_name: str
    category: str = "FOOD_AND_DRINK"
    date: str

class AutoDonateRequest(BaseModel):
    user_id: str
    transaction_amount: float
    original_transaction_id: str
    donation_percentage: float = 0.01  # 1% default
    date: str = None  # Optional date, will use current date if not provided
    charity_id: Optional[str] = None  # Optional charity ID for specific charity donation
    merchant_name: Optional[str] = None  # Optional merchant name
    product_name: Optional[str] = None  # Optional product name
    merchant_logo: Optional[str] = None  # Optional merchant logo URL

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

async def get_user_access_token(user_id: str) -> Optional[str]:
    """Get access token for a specific user"""
    # Try Supabase first, fall back to in-memory
    supabase_token = await supabase_service.get_access_token(user_id)
    if supabase_token:
        return supabase_token
    
    # Fallback to in-memory storage
    return None

@router.post("/get_transactions")
async def get_transactions(request: GetTransactionsRequest):
    """Get transactions for a user"""
    try:
        access_token = await get_user_access_token(request.user_id)
        if not access_token:
            raise HTTPException(status_code=404, detail="No access token available for this user")

        plaid_client = get_plaid_client()
        
        # Get transactions
        response = plaid_client.transactions_get({
            'access_token': access_token,
            'start_date': request.start_date,
            'end_date': request.end_date,
            'options': {
                'account_ids': request.account_ids
            }
        })

        return response.to_dict()

    except plaid.ApiException as e:
        logger.error(f"Plaid API error: {e}")
        raise HTTPException(status_code=400, detail=f"Plaid API error: {e}")
    except Exception as e:
        logger.error(f"Error getting transactions: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting transactions: {e}")

@router.post("/create_sandbox_transaction")
async def create_sandbox_transaction(request: CreateSandboxTransactionRequest):
    """Create a sandbox transaction for testing"""
    try:
        access_token = await get_user_access_token(request.user_id)
        if not access_token:
            raise HTTPException(status_code=404, detail="No access token available for this user")

        plaid_client = get_plaid_client()
        
        # Create sandbox transaction
        response = plaid_client.sandbox_transactions_create({
            'access_token': access_token,
            'transactions': [{
                'amount': request.amount,
                'date_transacted': request.date,
                'date_posted': request.date,
                'description': f"Transaction at {request.merchant_name}"
            }]
        })

        return response.to_dict()

    except plaid.ApiException as e:
        logger.error(f"Plaid API error: {e}")
        raise HTTPException(status_code=400, detail=f"Plaid API error: {e}")
    except Exception as e:
        logger.error(f"Error creating sandbox transaction: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating sandbox transaction: {e}")

@router.post("/auto_donate")
async def auto_donate(request: AutoDonateRequest):
    """Create auto-donation for a transaction using Pledge API"""
    try:
        # Calculate donation amount
        donation_amount = request.transaction_amount * request.donation_percentage
        
        # Use current date if not provided
        donation_date = request.date or datetime.now().strftime('%Y-%m-%d')
        
        # If specific charity_id is provided, use it
        if request.charity_id:
            charity_id = request.charity_id
            charity_name = await supabase_service.get_charity_name(charity_id)
        else:
            # Get user's charity preferences with allocation percentages
            charity_preferences = await supabase_service.get_user_charity_preferences(request.user_id)
            
            if not charity_preferences:
                # Fallback to mock donation if no preferences
                logger.info(f"No charity preferences found for user {request.user_id}, creating mock donation")
                return await create_mock_donation(request, donation_amount, donation_date)
            
            # For now, use the first charity preference
            # TODO: Implement distribution across multiple charities based on allocation percentages
            charity_id = charity_preferences[0]['charity_id']
            charity_name = await supabase_service.get_charity_name(charity_id)
        
        # For now, let's create a mock donation to test the flow
        # TODO: Fix Pledge API integration
        mock_donation_id = f"mock_donation_{int(datetime.now().timestamp())}"
        
        # Store donation record in database
        donation_data = {
            'user_id': request.user_id,
            'charity_id': charity_id,
            'charity_name': charity_name or f"Charity {charity_id}",
            'donation_amount': donation_amount,
            'transaction_id': mock_donation_id,
            'original_transaction_id': request.original_transaction_id,
            'donation_percentage': request.donation_percentage,
            'donation_date': donation_date,
            'merchant_name': request.merchant_name,
            'product_name': request.product_name,
            'merchant_logo': request.merchant_logo
        }
        
        donation_created = await supabase_service.create_user_donation(donation_data)
        if not donation_created:
            logger.error(f"Failed to create donation record for user: {request.user_id}")
        else:
            logger.info(f"Successfully created donation record for user: {request.user_id}")
        
        # Update user's total donation amount
        await supabase_service.update_user_total_donation(request.user_id, donation_amount)

        return {
            "success": True,
            "donation_amount": donation_amount,
            "charity_name": charity_name or f"Charity {charity_id}",
            "transaction_id": mock_donation_id,
            "charity_id": charity_id,
            "note": "Mock donation created - Pledge API integration pending"
        }
            
    except Exception as e:
        logger.error(f"Error creating auto-donation: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating auto-donation: {e}")

async def create_pledge_donation(charity_id: str, amount: float, user_id: str):
    """Create a donation through Pledge API"""
    try:
        from services.pledge_client import pledge_client
        from models import DonationRequest
        
        # Create donation request object
        donation_request = DonationRequest(
            organization_id=charity_id,
            amount=str(amount),  # Convert to string
            email=f"user_{user_id}@buy4good.com",  # Mock email
            first_name="User",
            last_name=user_id[:8],  # Use part of user ID as last name
            send_tax_receipt=False,  # Don't send tax receipt for auto-donations
            metadata=json.dumps({
                "source": "buy4good_auto_donation",
                "user_id": user_id,
                "anonymous": True
            })
        )
        
        # Call Pledge API to create donation
        response_data = await pledge_client.create_donation(donation_request)
        
        logger.info(f"Successfully created Pledge donation: {response_data.get('id')}")
        return response_data
        
    except Exception as e:
        logger.error(f"Error creating Pledge donation: {e}")
        return {"success": False, "error": str(e)}

async def create_mock_donation(request: AutoDonateRequest, donation_amount: float, donation_date: str):
    """Create a mock donation for testing purposes"""
    try:
        # Create sandbox transaction for donation
        access_token = await get_user_access_token(request.user_id)
        if not access_token:
            raise HTTPException(status_code=404, detail="No access token available for this user")

        plaid_client = get_plaid_client()
        
        # Create donation transaction with mock charity
        donation_response = plaid_client.sandbox_transactions_create({
            'access_token': access_token,
            'transactions': [{
                'amount': donation_amount,
                'date_transacted': donation_date,
                'date_posted': donation_date,
                'description': "Donation to Test Charity"
            }]
        })

        # Store donation in user_donation_summary table with mock charity
        donation_response_dict = donation_response.to_dict()
        transaction_id = donation_response_dict.get('transaction_id', 'mock_transaction_123')
        
        # Create donation record in user_donations table
        donation_data = {
            'user_id': request.user_id,
            'charity_id': 'mock_charity_123',
            'charity_name': 'Test Charity (Mock)',
            'donation_amount': donation_amount,
            'transaction_id': transaction_id,
            'original_transaction_id': request.original_transaction_id,
            'donation_percentage': request.donation_percentage,
            'donation_date': donation_date
        }
        
        donation_created = await supabase_service.create_user_donation(donation_data)
        if not donation_created:
            logger.error(f"Failed to create donation record for user: {request.user_id}")
        else:
            logger.info(f"Successfully created donation record for user: {request.user_id}")
        
        # Update user's total donation amount
        await supabase_service.update_user_total_donation(request.user_id, donation_amount)

        return {
            "success": True,
            "donation_amount": donation_amount,
            "charity_name": "Test Charity (Mock)",
            "transaction_id": transaction_id,
            "note": "Mock donation created for testing - no charity preferences found"
        }
        
    except Exception as e:
        logger.error(f"Error creating mock donation: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating mock donation: {e}")

        # Store donation in user_donation_summary table
        donation_response_dict = donation_response.to_dict()
        transaction_id = donation_response_dict.get('transaction_id', 'mock_transaction_123')
        
        donation_data = {
            'user_id': request.user_id,
            'total_donated': donation_amount,
            'total_transactions': 1,
            'charities_supported': 1,
            'last_donation_date': donation_date
        }
        
        # Create donation record in user_donations table
        donation_data = {
            'user_id': request.user_id,
            'charity_id': charity_id,
            'charity_name': f"Charity (ID: {charity_id})",
            'donation_amount': donation_amount,
            'transaction_id': transaction_id,
            'original_transaction_id': request.original_transaction_id,
            'donation_percentage': request.donation_percentage,
            'donation_date': donation_date
        }
        
        donation_created = await supabase_service.create_user_donation(donation_data)
        if not donation_created:
            logger.error(f"Failed to create donation record for user: {request.user_id}")
        else:
            logger.info(f"Successfully created donation record for user: {request.user_id}")
        
        # Update user's total donation amount
        await supabase_service.update_user_total_donation(request.user_id, donation_amount)

        return {
            "success": True,
            "donation_amount": donation_amount,
            "charity_name": f"Charity (ID: {charity_id})",
            "transaction_id": transaction_id
        }

    except plaid.ApiException as e:
        logger.error(f"Plaid API error: {e}")
        raise HTTPException(status_code=400, detail=f"Plaid API error: {e}")
    except Exception as e:
        logger.error(f"Error creating auto-donation: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating auto-donation: {e}")

@router.get("/health")
async def transactions_health_check():
    """Health check for transactions endpoint"""
    return {"status": "healthy", "message": "Transactions endpoint is working"}
