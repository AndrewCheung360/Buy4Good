from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from decimal import Decimal
import uuid


class DonationRequest(BaseModel):
    """Request model for creating a donation"""
    email: EmailStr = Field(..., description="Donor's email address")
    first_name: str = Field(..., description="Donor's first name")
    last_name: str = Field(..., description="Donor's last name")
    phone_number: Optional[str] = Field(None, description="Donor's phone number")
    amount: str = Field(..., description="Donation amount as decimal string")
    metadata: Optional[str] = Field(None, description="Arbitrary metadata string")
    send_tax_receipt: Optional[bool] = Field(True, description="Send tax receipt to donor's email")
    organization_id: str = Field(..., description="UUID of the organization to donate to")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "btyrese@gmail.com",
                "first_name": "Brock",
                "last_name": "Tyrese",
                "phone_number": "+13235550107",
                "amount": "0.25",
                "metadata": "arbitrary data string",
                "send_tax_receipt": True,
                "organization_id": "3685b542-61d5-45da-9580-162dca725966"
            }
        }


class Cause(BaseModel):
    """Model for cause information"""
    id: int
    name: str
    parent_id: Optional[int] = None


class ImpactMetric(BaseModel):
    """Model for impact metrics"""
    amount: str
    currency: str
    description: str


class SustainableDevelopmentGoal(BaseModel):
    """Model for sustainable development goals"""
    id: int
    name: str


class Organization(BaseModel):
    """Model for organization information"""
    id: str
    name: str
    alias: Optional[str] = None
    ngo_id: str
    mission: str
    street1: str
    street2: Optional[str] = None
    city: str
    region: str
    postal_code: int
    country: str
    lat: str
    lon: str
    causes: List[Cause] = Field(default_factory=list)
    website_url: Optional[str] = None
    profile_url: Optional[str] = None
    logo_url: Optional[str] = None
    disbursement_type: str
    impact_metrics: List[ImpactMetric] = Field(default_factory=list)
    sustainable_development_goals: List[SustainableDevelopmentGoal] = Field(default_factory=list)


class OrganizationsListResponse(BaseModel):
    """Response model for organizations list"""
    organizations: List[Organization]
    total_count: Optional[int] = None
    page: Optional[int] = None
    per_page: Optional[int] = None


class Beneficiary(BaseModel):
    """Model for beneficiary information (simplified organization in donation response)"""
    id: str
    name: str
    alias: Optional[str] = None
    ngo_id: Optional[str] = None
    mission: Optional[str] = None
    street1: Optional[str] = None
    street2: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    postal_code: Optional[int] = None



class DonationResponse(BaseModel):
    """Response model for donation creation"""
    id: str = Field(..., description="Donation ID")
    email: EmailStr = Field(..., description="Donor's email address")
    first_name: str = Field(..., description="Donor's first name")
    last_name: str = Field(..., description="Donor's last name")
    phone_number: Optional[str] = Field(None, description="Donor's phone number")
    amount: str = Field(..., description="Donation amount")
    metadata: Optional[str] = Field(None, description="Metadata")
    organization_id: str = Field(..., description="Organization ID")
    organization_name: str = Field(..., description="Organization name")
    beneficiaries: List[Beneficiary] = Field(default_factory=list, description="List of beneficiaries")
    user_id: Optional[str] = Field(None, description="User ID")
    status: str = Field(..., description="Donation status")
    external_id: Optional[str] = Field(None, description="External ID")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Update timestamp")


class SimulateTransactionRequest(BaseModel):
    """Request model for simulating a transaction"""
    merchant_id: str = Field(..., description="Merchant ID")
    amount: str = Field(..., description="Transaction amount")
    currency: str = Field(default="USD", description="Currency code")
    user_id: Optional[str] = Field(None, description="User ID")
    metadata: Optional[dict] = Field(None, description="Additional metadata")


class SimulateTransactionResponse(BaseModel):
    """Response model for transaction simulation"""
    transaction_id: str = Field(..., description="Transaction ID")
    status: str = Field(..., description="Transaction status")
    amount: str = Field(..., description="Transaction amount")
    commission: Optional[str] = Field(None, description="Commission amount")
    created_at: str = Field(..., description="Creation timestamp")


class WebhookRequest(BaseModel):
    """Request model for webhook handling"""
    event_type: str = Field(..., description="Type of webhook event")
    data: dict = Field(..., description="Webhook data payload")
    timestamp: str = Field(..., description="Event timestamp")
    signature: Optional[str] = Field(None, description="Webhook signature for verification")


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    status_code: int = Field(..., description="HTTP status code")
