import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    """Application settings"""
    
    # Pledge.to API Configuration
    PLEDGE_TO_API_KEY: str = os.getenv("PLEDGE_TO_API_KEY", "")
    PLEDGE_TO_SANDBOX_API_KEY: str = os.getenv("PLEDGE_TO_SANDBOX_API_KEY", "")
    PLEDGE_TO_BASE_URL: str = os.getenv("PLEDGE_TO_BASE_URL", "https://api.pledge.to")
    PLEDGE_TO_SANDBOX_URL: str = os.getenv("PLEDGE_TO_SANDBOX_URL", "https://api-staging.pledge.to")
    USE_SANDBOX_FOR_DONATIONS: bool = os.getenv("USE_SANDBOX_FOR_DONATIONS", "true").lower() == "true"
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Buy4Good API"
    VERSION: str = "1.0.0"
    
    @property
    def donation_base_url(self) -> str:
        """Get the base URL for donation operations (sandbox for donations)"""
        return self.PLEDGE_TO_SANDBOX_URL if self.USE_SANDBOX_FOR_DONATIONS else self.PLEDGE_TO_BASE_URL
    
    @property
    def organization_base_url(self) -> str:
        """Get the base URL for organization operations (production)"""
        return self.PLEDGE_TO_BASE_URL
    
    @property
    def donation_api_key(self) -> str:
        """Get the API key for donation operations"""
        if self.USE_SANDBOX_FOR_DONATIONS:
            return self.PLEDGE_TO_SANDBOX_API_KEY or self.PLEDGE_TO_API_KEY
        return self.PLEDGE_TO_API_KEY
    
    @property
    def organization_api_key(self) -> str:
        """Get the API key for organization operations (always production)"""
        return self.PLEDGE_TO_API_KEY
    
    def validate_settings(self):
        """Validate required settings"""
        if not self.PLEDGE_TO_API_KEY:
            raise ValueError("PLEDGE_TO_API_KEY environment variable is required")
        
        if self.USE_SANDBOX_FOR_DONATIONS and not self.PLEDGE_TO_SANDBOX_API_KEY:
            print("⚠️  Warning: USE_SANDBOX_FOR_DONATIONS is true but PLEDGE_TO_SANDBOX_API_KEY is not set.")
            print("   Using production API key for sandbox operations.")
        
        return True

settings = Settings()
