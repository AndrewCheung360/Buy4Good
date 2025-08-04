import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.supabase_client import supabase_service

logger = logging.getLogger(__name__)
router = APIRouter()

# Pydantic models
class UpdateDonationPercentageRequest(BaseModel):
    user_id: str
    auto_donation_percentage: float

class ToggleAutoDonateRequest(BaseModel):
    user_id: str
    auto_donate_enabled: bool

@router.post("/update_donation_percentage")
async def update_donation_percentage(request: UpdateDonationPercentageRequest):
    """Update user's auto-donation percentage"""
    try:
        if request.auto_donation_percentage < 0 or request.auto_donation_percentage > 0.1:
            raise HTTPException(status_code=400, detail="Donation percentage must be between 0% and 10%")

        success = await supabase_service.update_donation_percentage(
            request.user_id, 
            request.auto_donation_percentage
        )

        if success:
            return {
                "success": True,
                "message": "Donation percentage updated successfully",
                "percentage": request.auto_donation_percentage
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update donation percentage")

    except Exception as e:
        logger.error(f"Error updating donation percentage: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating donation percentage: {e}")

@router.post("/toggle_auto_donate")
async def toggle_auto_donate(request: ToggleAutoDonateRequest):
    """Toggle auto-donate feature for a user"""
    try:
        success = await supabase_service.toggle_auto_donate(
            request.user_id, 
            request.auto_donate_enabled
        )

        if success:
            return {
                "success": True,
                "message": f"Auto-donate {'enabled' if request.auto_donate_enabled else 'disabled'} successfully",
                "enabled": request.auto_donate_enabled
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to toggle auto-donate")

    except Exception as e:
        logger.error(f"Error toggling auto-donate: {e}")
        raise HTTPException(status_code=500, detail=f"Error toggling auto-donate: {e}")

@router.get("/get_user_settings/{user_id}")
async def get_user_settings(user_id: str):
    """Get user's settings including auto-donation preferences"""
    try:
        settings = await supabase_service.get_user_settings(user_id)
        
        return {
            "success": True,
            "settings": settings
        }

    except Exception as e:
        logger.error(f"Error getting user settings: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting user settings: {e}")

@router.get("/settings_health")
async def settings_health_check():
    """Health check for settings endpoint"""
    return {"status": "healthy", "message": "Settings endpoint is working"} 