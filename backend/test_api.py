import asyncio
import httpx
import json


async def test_endpoints():
    """Test all the API endpoints"""
    
    base_url = "http://localhost:8000"
    
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
            
            # Test organizations list
            print("3. Testing organizations list...")
            response = await client.get(f"{base_url}/api/v1/organizations?per_page=2")
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Found {len(data.get('organizations', []))} organizations")
                print(f"Response: {json.dumps(data, indent=2)}\n")
            else:
                print(f"Error: {response.text}\n")
            
            # Test specific organization
            print("4. Testing specific organization...")
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
            print("5. Testing donation endpoint (sandbox)...")
            donation_data = {
                "email": "darkmusician420@gmail.com",
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
            print("6. Testing transaction simulation...")
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
            print("7. Testing webhook endpoint...")
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
            
        except httpx.ConnectError:
            print("❌ Could not connect to server. Make sure the server is running on localhost:8000")
        except Exception as e:
            print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(test_endpoints())
