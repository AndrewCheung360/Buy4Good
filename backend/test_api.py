import asyncio
import httpx
import json
from datetime import datetime, timedelta


async def test_endpoints():
    """Test all the API endpoints"""
    
    base_url = "http://localhost:8000"
    test_user_id = "test_user_123"
    
    async with httpx.AsyncClient() as client:
        try:
            print("=== Testing Buy4Good API ===\n")
            
            # Test root endpoint
            print("1. Testing root endpoint...")
            response = await client.get(f"{base_url}/")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test health endpoint
            print("2. Testing health endpoint...")
            response = await client.get(f"{base_url}/health")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test ping endpoint
            print("3. Testing ping endpoint...")
            response = await client.get(f"{base_url}/ping")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test organizations list
            print("4. Testing organizations list...")
            response = await client.get(f"{base_url}/api/v1/organizations?per_page=2")
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Found {len(data.get('organizations', []))} organizations")
                print(f"Response: {json.dumps(data, indent=2)}\n")
            else:
                print(f"Error: {response.text}\n")
            
            # Test specific organization
            print("5. Testing specific organization...")
            org_id = "3685b542-61d5-45da-9580-162dca725966"
            response = await client.get(f"{base_url}/api/v1/organizations/{org_id}")
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Organization: {data.get('name', 'Unknown')}")
                print(f"Response: {json.dumps(data, indent=2)}\n")
            else:
                print(f"Error: {response.text}\n")
            
            # Test donation endpoint (sandbox)
            print("6. Testing donation endpoint (sandbox)...")
            donation_data = {
                "email": "test@example.com",
                "first_name": "John",
                "last_name": "Doe",  
                "phone_number": "+1234567890",
                "amount": "5.00",
                "metadata": "test donation from Buy4Good API",
                "send_tax_receipt": True,
                "organization_id": "1008c9ce-344d-4e2e-a8e0-39b8f0ff46a6"
            }
            
            response = await client.post(
                f"{base_url}/api/v1/donations",
                json=donation_data,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test transaction simulation
            print("7. Testing transaction simulation...")
            transaction_data = {
                "merchant_id": "test_merchant_123",
                "amount": "25.99",
                "currency": "USD",
                "user_id": "user_456",
                "metadata": {"source": "test"}
            }
            
            response = await client.post(
                f"{base_url}/api/v1/simulate-transaction",
                json=transaction_data,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test webhook endpoint
            print("8. Testing webhook endpoint...")
            webhook_data = {
                "event_type": "transaction.completed",
                "data": {
                    "transaction_id": "txn_123",
                    "amount": "10.00",
                    "merchant": "test_merchant"
                },
                "timestamp": "2024-01-01T00:00:00Z"
            }
            
            response = await client.post(
                f"{base_url}/api/v1/webhook",
                json=webhook_data,
                headers={"X-Signature": "test_signature"},
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test Plaid endpoints
            print("=== Testing Plaid Endpoints ===\n")
            
            # Test Plaid health check
            print("9. Testing Plaid health check...")
            response = await client.get(f"{base_url}/api/v1/plaid/health")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test create link token
            print("10. Testing create link token...")
            link_token_data = {
                "address": "localhost",
                "user_id": test_user_id
            }
            
            response = await client.post(
                f"{base_url}/api/v1/plaid/create_link_token",
                json=link_token_data,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Link token created successfully")
                print(f"Response: {json.dumps(data, indent=2)}\n")
            else:
                print(f"Error: {response.text}\n")
            
            # Test check Plaid connection
            print("11. Testing check Plaid connection...")
            response = await client.get(f"{base_url}/api/v1/plaid/check_connection/{test_user_id}")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test get total donation
            print("12. Testing get total donation...")
            response = await client.get(f"{base_url}/api/v1/plaid/total_donation/{test_user_id}")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test get recent donations
            print("13. Testing get recent donations...")
            response = await client.get(f"{base_url}/api/v1/plaid/recent_donations/{test_user_id}?limit=5")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test transactions endpoints
            print("=== Testing Transactions Endpoints ===\n")
            
            # Test transactions health check
            print("14. Testing transactions health check...")
            response = await client.get(f"{base_url}/api/v1/transactions/health")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test create sandbox transaction
            print("15. Testing create sandbox transaction...")
            sandbox_transaction_data = {
                "user_id": test_user_id,
                "amount": 15.99,
                "merchant_name": "Test Coffee Shop",
                "category": "FOOD_AND_DRINK",
                "date": datetime.now().strftime('%Y-%m-%d')
            }
            
            response = await client.post(
                f"{base_url}/api/v1/transactions/create_sandbox_transaction",
                json=sandbox_transaction_data,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Sandbox transaction created successfully")
                print(f"Response: {json.dumps(data, indent=2)}\n")
            else:
                print(f"Error: {response.text}\n")
            
            # Test auto donate
            print("16. Testing auto donate...")
            auto_donate_data = {
                "user_id": test_user_id,
                "transaction_amount": 25.50,
                "original_transaction_id": "test_transaction_123",
                "donation_percentage": 0.02,  # 2%
                "date": datetime.now().strftime('%Y-%m-%d')
            }
            
            response = await client.post(
                f"{base_url}/api/v1/transactions/auto_donate",
                json=auto_donate_data,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test get transactions
            print("17. Testing get transactions...")
            get_transactions_data = {
                "user_id": test_user_id,
                "start_date": (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),
                "end_date": datetime.now().strftime('%Y-%m-%d')
            }
            
            response = await client.post(
                f"{base_url}/api/v1/transactions/get_transactions",
                json=get_transactions_data,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Transactions retrieved successfully")
                print(f"Response: {json.dumps(data, indent=2)}\n")
            else:
                print(f"Error: {response.text}\n")
            
            # Test settings endpoints
            print("=== Testing Settings Endpoints ===\n")
            
            # Test settings health check
            print("18. Testing settings health check...")
            response = await client.get(f"{base_url}/api/v1/settings/settings_health")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test get user settings
            print("19. Testing get user settings...")
            response = await client.get(f"{base_url}/api/v1/settings/get_user_settings/{test_user_id}")
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test update donation percentage
            print("20. Testing update donation percentage...")
            update_percentage_data = {
                "user_id": test_user_id,
                "auto_donation_percentage": 0.03  # 3%
            }
            
            response = await client.post(
                f"{base_url}/api/v1/settings/update_donation_percentage",
                json=update_percentage_data,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            # Test toggle auto donate
            print("21. Testing toggle auto donate...")
            toggle_auto_donate_data = {
                "user_id": test_user_id,
                "auto_donate_enabled": True
            }
            
            response = await client.post(
                f"{base_url}/api/v1/settings/toggle_auto_donate",
                json=toggle_auto_donate_data,
                timeout=30.0
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}\n")
            
            print("=== All Tests Completed ===\n")
            
        except httpx.ConnectError:
            print("❌ Could not connect to server. Make sure the server is running on localhost:8000")
        except Exception as e:
            print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(test_endpoints())
