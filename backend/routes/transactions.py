from fastapi import APIRouter, HTTPException, status, Header
from fastapi.responses import JSONResponse
from models import SimulateTransactionRequest, SimulateTransactionResponse, WebhookRequest, ErrorResponse
import logging
from typing import Optional
import uuid
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/simulate-transaction",
    response_model=SimulateTransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Simulate a transaction",
    description="Simulate a transaction for testing affiliate network integration.",
    responses={
        201: {"model": SimulateTransactionResponse, "description": "Transaction simulated successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request data"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def simulate_transaction(transaction_request: SimulateTransactionRequest):
    """
    Simulate a transaction for testing purposes.
    
    This endpoint simulates what would happen when a user makes a purchase
    through an affiliate network, generating a mock transaction response.
    """
    try:
        logger.info(f"Simulating transaction for merchant {transaction_request.merchant_id}, amount: {transaction_request.amount}")
        
        # Generate mock transaction data
        transaction_id = str(uuid.uuid4())
        
        # Calculate mock commission (5% of transaction amount)
        amount_float = float(transaction_request.amount)
        commission = str(round(amount_float * 0.05, 2))
        
        response_data = {
            "transaction_id": transaction_id,
            "status": "completed",
            "amount": transaction_request.amount,
            "commission": commission,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }
        
        logger.info(f"Transaction simulated successfully with ID: {transaction_id}")
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=response_data
        )
        
    except ValueError as e:
        logger.error(f"Invalid amount format: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid amount format"
        )
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.post(
    "/webhook",
    summary="Handle affiliate network webhook",
    description="Handle incoming webhooks from affiliate networks.",
    responses={
        200: {"description": "Webhook processed successfully"},
        400: {"model": ErrorResponse, "description": "Invalid webhook data"},
        401: {"model": ErrorResponse, "description": "Invalid webhook signature"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def handle_webhook(
    webhook_request: WebhookRequest,
    x_signature: Optional[str] = Header(None, description="Webhook signature for verification")
):
    """
    Handle incoming webhooks from affiliate networks.
    
    This endpoint processes webhook events from various affiliate networks
    and triggers appropriate actions based on the event type.
    """
    try:
        logger.info(f"Received webhook event: {webhook_request.event_type}")
        
        # In a real implementation, you would:
        # 1. Verify the webhook signature
        # 2. Process the event based on event_type
        # 3. Update database records
        # 4. Trigger donations or other actions
        
        # For now, we'll just log the event and return success
        logger.info(f"Processing webhook data: {webhook_request.data}")
        
        # Mock processing based on event type
        if webhook_request.event_type == "transaction.completed":
            logger.info("Processing completed transaction webhook")
            # Here you might trigger a donation or update transaction status
            
        elif webhook_request.event_type == "commission.earned":
            logger.info("Processing commission earned webhook")
            # Here you might calculate donation amounts based on commission
            
        elif webhook_request.event_type == "user.signup":
            logger.info("Processing user signup webhook")
            # Here you might create user records or send welcome messages
            
        else:
            logger.warning(f"Unknown webhook event type: {webhook_request.event_type}")
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "success",
                "message": f"Webhook event '{webhook_request.event_type}' processed successfully",
                "processed_at": datetime.utcnow().isoformat() + "Z"
            }
        )
        
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process webhook"
        )
