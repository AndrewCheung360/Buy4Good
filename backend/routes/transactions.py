import os
import logging
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
            'amount': request.amount,
            'merchant_name': request.merchant_name,
            'category': [request.category],
            'date': request.date
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
    """Create auto-donation for a transaction"""
    try:
        # Calculate donation amount
        donation_amount = request.transaction_amount * request.donation_percentage
        
        # Get user's liked charities from Supabase
        liked_charities = await supabase_service.get_liked_charities(request.user_id)
        
        if not liked_charities:
            # For testing purposes, create a mock charity donation
            logger.info(f"No liked charities found for user {request.user_id}, creating mock donation")
            
            # Create sandbox transaction for donation
            access_token = await get_user_access_token(request.user_id)
            if not access_token:
                raise HTTPException(status_code=404, detail="No access token available for this user")

            plaid_client = get_plaid_client()
            
            # Use current date if not provided
            donation_date = request.date or datetime.now().strftime('%Y-%m-%d')
            
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
                "note": "Mock donation created for testing - no liked charities found"
            }
        
        # Create sandbox transaction for donation
        access_token = await get_user_access_token(request.user_id)
        if not access_token:
            raise HTTPException(status_code=404, detail="No access token available for this user")

        plaid_client = get_plaid_client()
        
        # Use current date if not provided
        donation_date = request.date or datetime.now().strftime('%Y-%m-%d')
        
        # Get the first liked charity ID
        charity_id = liked_charities[0] if liked_charities else 'default_charity_123'
        
        # Create donation transaction
        donation_response = plaid_client.sandbox_transactions_create({
            'access_token': access_token,
            'transactions': [{
                'amount': donation_amount,
                'date_transacted': donation_date,
                'date_posted': donation_date,
                'description': f"Donation to Charity (ID: {charity_id})"
            }]
        })

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
