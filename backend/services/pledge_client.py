import requests
import json
from typing import Dict, Any, Optional
from config import settings
from models import DonationRequest


class PledgeToClient:
    """Enhanced client for interacting with Pledge.to API"""
    
    def __init__(self):
        # We'll set headers dynamically based on the operation
        pass
    
    def _get_donation_headers(self) -> Dict[str, str]:
        """Get headers for donation operations (uses sandbox API key if enabled)"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.donation_api_key}"
        }
    
    def _get_organization_headers(self) -> Dict[str, str]:
        """Get headers for organization operations (always uses production API key)"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.organization_api_key}"
        }
    
    async def create_donation(self, donation_data: DonationRequest) -> Dict[str, Any]:
        """
        Create a donation through Pledge.to API (using sandbox if configured)
        
        Args:
            donation_data: The donation request data
            
        Returns:
            Dictionary containing the API response
            
        Raises:
            requests.HTTPError: If the API request fails
        """
        payload = {
            "email": donation_data.email,
            "first_name": donation_data.first_name,
            "last_name": donation_data.last_name,
            "amount": donation_data.amount,
            "organization_id": donation_data.organization_id,
            "send_tax_receipt": donation_data.send_tax_receipt
        }
        
        # Add optional fields if provided
        if donation_data.phone_number:
            payload["phone_number"] = donation_data.phone_number
        if donation_data.metadata:
            payload["metadata"] = donation_data.metadata
        
        # Use requests instead of httpx
        response = requests.post(
            f"{settings.donation_base_url}/v1/donations",
            json=payload,
            headers=self._get_donation_headers(),
            timeout=30.0
        )
        
        # Raise an exception for HTTP error responses
        response.raise_for_status()
        
        return response.json()
    
    async def get_organization_by_id(self, organization_id: str) -> Dict[str, Any]:
        """
        Get organization details by ID (uses production API)
        
        Args:
            organization_id: The organization ID
            
        Returns:
            Dictionary containing the organization data
            
        Raises:
            requests.HTTPError: If the API request fails
        """
        response = requests.get(
            f"{settings.organization_base_url}/v1/organizations/{organization_id}",
            headers=self._get_organization_headers(),
            timeout=30.0
        )
        
        response.raise_for_status()
        return response.json()
    
    async def list_organizations(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Get list of organizations with optional filtering (uses production API)
        
        Args:
            params: Query parameters for filtering (page, per_page, search, etc.)
            
        Returns:
            Dictionary containing the organizations list
            
        Raises:
            requests.HTTPError: If the API request fails
        """
        response = requests.get(
            f"{settings.organization_base_url}/v1/organizations",
            headers=self._get_organization_headers(),
            params=params or {},
            timeout=30.0
        )
        
        response.raise_for_status()
        
        # The API might return just an array or an object with metadata
        data = response.json()
        
        # If it's just an array, wrap it in our expected format
        if isinstance(data, list):
            return {
                "organizations": data,
                "total_count": len(data),
                "page": params.get("page", 1) if params else 1,
                "per_page": params.get("per_page", 20) if params else 20
            }
        
        return data
    
    async def health_check(self) -> bool:
        """
        Check if the Pledge.to API is accessible (uses production API for health check)
        
        Returns:
            True if API is accessible, False otherwise
        """
        try:
            # Try to access the organizations endpoint as a health check
            response = requests.get(
                f"{settings.organization_base_url}/v1/organizations",
                headers=self._get_organization_headers(),
                params={"per_page": 1},  # Limit to 1 result for faster response
                timeout=10.0
            )
            return response.status_code == 200
        except:
            return False


# Global client instance
pledge_client = PledgeToClient()
