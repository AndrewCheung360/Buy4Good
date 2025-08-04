import os
from typing import Optional
from supabase import create_client, Client
import logging

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not configured. Using in-memory storage as fallback.")
            self.client = None
        else:
            self.client = create_client(self.supabase_url, self.supabase_key)
    
    async def store_access_token(self, user_id: str, access_token: str) -> bool:
        """Store access token for a user"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, skipping token storage")
                return False
            
            # Upsert the token (insert or update if exists)
            result = self.client.table('user_plaid_tokens').upsert({
                'user_id': user_id,
                'access_token': access_token,
                'updated_at': 'now()'
            }).execute()
            
            logger.info(f"Successfully stored access token for user: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error storing access token for user {user_id}: {str(e)}")
            return False
    
    async def get_access_token(self, user_id: str) -> Optional[str]:
        """Retrieve access token for a user"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, returning None")
                return None
            
            result = self.client.table('user_plaid_tokens').select('access_token').eq('user_id', user_id).single().execute()
            
            if result.data:
                logger.info(f"Successfully retrieved access token for user: {user_id}")
                return result.data['access_token']
            else:
                logger.info(f"No access token found for user: {user_id}")
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving access token for user {user_id}: {str(e)}")
            return None
    
    async def delete_access_token(self, user_id: str) -> bool:
        """Delete access token for a user"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, skipping token deletion")
                return False
            
            result = self.client.table('user_plaid_tokens').delete().eq('user_id', user_id).execute()
            
            logger.info(f"Successfully deleted access token for user: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting access token for user {user_id}: {str(e)}")
            return False

    async def get_liked_charities(self, user_id: str) -> list:
        """Get user's liked charities"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, returning empty list")
                return []
            
            result = self.client.table('user_charity_preferences').select('charity_id').eq('user_id', user_id).execute()
            
            if result.data:
                # Return just the charity IDs since we don't have a local charities table
                charity_ids = [item['charity_id'] for item in result.data]
                logger.info(f"Found {len(charity_ids)} liked charity IDs for user: {user_id}")
                return charity_ids
            else:
                logger.info(f"No liked charities found for user: {user_id}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting liked charities for user {user_id}: {str(e)}")
            return []

    async def create_user_donation(self, donation_data: dict) -> bool:
        """Create a donation record in user_donations table"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, skipping donation creation")
                return False
            
            logger.info(f"Creating user donation record: {donation_data}")
            
            result = self.client.table('user_donations').insert(donation_data).execute()
            
            logger.info(f"User donation record created successfully for user: {donation_data['user_id']}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating user donation record: {str(e)}")
            return False

    async def update_user_total_donation(self, user_id: str, donation_amount: float) -> bool:
        """Update user's total donation amount in users table"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, skipping total donation update")
                return False
            
            # First get current total donation amount
            try:
                result = self.client.table('users').select('total_donation_amount').eq('id', user_id).single().execute()
                current_total = result.data.get('total_donation_amount', 0) if result.data else 0
            except:
                # User doesn't exist in users table, create them
                logger.info(f"User {user_id} not found in users table, creating record")
                result = self.client.table('users').insert({
                    'id': user_id,
                    'total_donation_amount': donation_amount,
                    'created_at': 'now()',
                    'updated_at': 'now()'
                }).execute()
                logger.info(f"Successfully created user record with total donation amount: {donation_amount}")
                return True
            
            new_total = current_total + donation_amount
            
            # Update the total donation amount
            result = self.client.table('users').update({
                'total_donation_amount': new_total,
                'updated_at': 'now()'
            }).eq('id', user_id).execute()
            
            logger.info(f"Successfully updated total donation amount for user {user_id}: {current_total} -> {new_total}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating total donation amount for user {user_id}: {str(e)}")
            return False

    async def get_user_total_donation(self, user_id: str) -> float:
        """Get user's total donation amount"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, returning 0 for total donation")
                return 0.0
            
            result = self.client.table('users').select('total_donation_amount').eq('id', user_id).single().execute()
            
            if result.data:
                total = result.data.get('total_donation_amount', 0)
                logger.info(f"Found total donation amount for user {user_id}: {total}")
                return total
            else:
                logger.info(f"No total donation amount found for user {user_id}, using 0")
                return 0.0
                
        except Exception as e:
            logger.error(f"Error getting total donation amount for user {user_id}: {str(e)}")
            return 0.0

    async def get_recent_donations(self, user_id: str, limit: int = 10) -> list:
        """Get recent donations for a user"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, returning empty list for recent donations")
                return []
            
            logger.info(f"Fetching recent donations for user: {user_id}")
            
            # Get recent donations from user_donations table
            result = self.client.table('user_donations')\
                .select('*')\
                .eq('user_id', user_id)\
                .order('donation_date', desc=True)\
                .limit(limit)\
                .execute()
            
            logger.info(f"Query result: {result.data}")
            
            if result.data:
                logger.info(f"Found {len(result.data)} recent donations for user {user_id}")
                return result.data
            else:
                logger.info(f"No recent donations found for user {user_id}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting recent donations for user {user_id}: {str(e)}")
            return []

    async def get_user_donation_percentage(self, user_id: str) -> float:
        """Get user's auto-donation percentage from settings"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, returning default percentage")
                return 0.01  # 1% default
            
            result = self.client.table('user_settings').select('auto_donation_percentage').eq('user_id', user_id).single().execute()
            
            if result.data:
                logger.info(f"Found auto-donation percentage for user {user_id}: {result.data['auto_donation_percentage']}")
                return result.data['auto_donation_percentage']
            else:
                logger.info(f"No auto-donation percentage found for user {user_id}, using default")
                return 0.01  # 1% default
                
        except Exception as e:
            logger.error(f"Error getting auto-donation percentage for user {user_id}: {str(e)}")
            return 0.01  # 1% default

    async def update_donation_percentage(self, user_id: str, percentage: float) -> bool:
        """Update user's auto-donation percentage"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, skipping percentage update")
                return False
            
            result = self.client.table('user_settings').upsert({
                'user_id': user_id,
                'auto_donation_percentage': percentage,
                'updated_at': 'now()'
            }).execute()
            
            logger.info(f"Successfully updated donation percentage for user: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating donation percentage for user {user_id}: {str(e)}")
            return False

    async def toggle_auto_donate(self, user_id: str, enabled: bool) -> bool:
        """Toggle auto-donate feature for a user"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, skipping auto-donate toggle")
                return False
            
            logger.info(f"Attempting to toggle auto-donate for user: {user_id} to {enabled}")
            
            # Check if user settings exist
            try:
                result = self.client.table('user_settings').select('*').eq('user_id', user_id).single().execute()
                if result.data:
                    # Update existing record
                    logger.info(f"Updating existing settings for user: {user_id}")
                    result = self.client.table('user_settings').update({
                        'auto_donate_enabled': enabled,
                        'updated_at': 'now()'
                    }).eq('user_id', user_id).execute()
                else:
                    # Insert new record
                    logger.info(f"Creating new settings for user: {user_id}")
                    result = self.client.table('user_settings').insert({
                        'user_id': user_id,
                        'auto_donation_percentage': 0.01,
                        'auto_donate_enabled': enabled,
                        'updated_at': 'now()'
                    }).execute()
            except Exception as e:
                # If no record exists, create one
                logger.info(f"Creating new settings for user: {user_id} (no existing record)")
                result = self.client.table('user_settings').insert({
                    'user_id': user_id,
                    'auto_donation_percentage': 0.01,
                    'auto_donate_enabled': enabled,
                    'updated_at': 'now()'
                }).execute()
            
            logger.info(f"Successfully toggled auto-donate for user: {user_id} to {enabled}")
            return True
            
        except Exception as e:
            logger.error(f"Error toggling auto-donate for user {user_id}: {str(e)}")
            return False

    async def get_user_settings(self, user_id: str) -> dict:
        """Get all user settings"""
        try:
            if not self.client:
                logger.warning("Supabase not configured, returning default settings")
                return {
                    'auto_donation_percentage': 0.01,
                    'auto_donate_enabled': False
                }
            
            result = self.client.table('user_settings').select('*').eq('user_id', user_id).single().execute()
            
            if result.data:
                logger.info(f"Found settings for user {user_id}")
                return result.data
            else:
                logger.info(f"No settings found for user {user_id}, returning defaults")
                return {
                    'auto_donation_percentage': 0.01,
                    'auto_donate_enabled': False
                }
                
        except Exception as e:
            logger.error(f"Error getting settings for user {user_id}: {str(e)}")
            return {
                'auto_donation_percentage': 0.01,
                'auto_donate_enabled': False
            }

# Global instance
supabase_service = SupabaseService() 