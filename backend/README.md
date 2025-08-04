# Buy4Good Backend API

A FastAPI-based backend server for handling donations, organization data, transaction simulation, and affiliate network webhooks through the Pledge.to API.

For complete project documentation, setup instructions, and frontend information, please see the [main project README](../README.md).

## Quick Start

1. Create virtual environment

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies

   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables

   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. Start the server
   ```bash
   python main.py
   ```

## API Documentation

Once running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
routes/
├── donations.py           # Donation processing endpoints
├── organizations.py       # Charity organization data
├── transactions.py        # Transaction simulation & webhooks
├── plaid.py              # Plaid Link integration
└── health.py             # Health monitoring

services/
└── pledge_client.py      # Pledge.to API integration

models.py                 # Pydantic data models
config.py                # Configuration settings
main.py                  # FastAPI application
```

## Key Features

- 💸 Sandbox donation processing via Pledge.to
- 🏢 Nonprofit organization data management
- 🔄 Transaction simulation for testing
- 🪝 Webhook handling for affiliate networks
- 🏦 Plaid Link integration for bank account connectivity
- 📚 Automatic API documentation
- 🏥 Comprehensive health monitoring

For detailed setup instructions, frontend integration, and contribution guidelines, see the [main README](../README.md).

````

Edit `.env` and set your configuration:

```env
# Pledge.to API Configuration
PLEDGE_TO_API_KEY=your_production_api_key_here
PLEDGE_TO_SANDBOX_API_KEY=your_sandbox_api_key_here
PLEDGE_TO_BASE_URL=https://api.pledge.to
PLEDGE_TO_SANDBOX_URL=https://api-staging.pledge.to
USE_SANDBOX_FOR_DONATIONS=true

# Plaid API Configuration
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox  # or 'development' for development environment
PLAID_SANDBOX_REDIRECT_URI=your_redirect_uri  # Optional: for iOS
PLAID_ANDROID_PACKAGE_NAME=your_android_package_name  # Optional: for Android

# Supabase Configuration (for storing Plaid access tokens)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true
````

### 4. Run the Server

```bash
./start.sh
```

Or manually:

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Documentation

Once the server is running, you can access:

- **Interactive API docs (Swagger)**: http://localhost:8000/docs
- **Alternative API docs (ReDoc)**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Donations

#### POST /api/v1/donations

Create a donation to a nonprofit organization (uses sandbox).

**Request Body:**

```json
{
  "email": "donor@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "amount": "25.00",
  "metadata": "Optional metadata",
  "send_tax_receipt": true,
  "organization_id": "3685b542-61d5-45da-9580-162dca725966"
}
```

### Organizations

#### GET /api/v1/organizations

List nonprofit organizations with optional filtering.

**Query Parameters:**

- `page`: Page number (default: 1)
- `per_page`: Results per page (default: 20, max: 100)
- `search`: Search term for organization name
- `cause_id`: Filter by cause ID

#### GET /api/v1/organizations/{organization_id}

Get detailed information about a specific organization.

### Transactions

#### POST /api/v1/simulate-transaction

Simulate a transaction for testing affiliate network integration.

**Request Body:**

```json
{
  "merchant_id": "merchant_123",
  "amount": "25.99",
  "currency": "USD",
  "user_id": "user_456",
  "metadata": { "source": "affiliate" }
}
```

#### POST /api/v1/webhook

Handle incoming webhooks from affiliate networks.

**Request Body:**

```json
{
  "event_type": "transaction.completed",
  "data": {
    "transaction_id": "txn_123",
    "amount": "10.00"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "signature": "webhook_signature"
}
```

### Plaid Integration

#### POST /api/v1/create_link_token

Create a Plaid Link token for connecting bank accounts.

**Request Body:**

```json
{
  "address": "localhost" // "localhost" for iOS, "android" for Android
}
```

**Response:**

```json
{
  "link_token": "link-sandbox-...",
  "expiration": "2025-08-04T04:35:43+00:00",
  "request_id": "..."
}
```

#### POST /api/v1/exchange_public_token

Exchange a public token from Plaid Link for an access token.

**Request Body:**

```json
{
  "public_token": "public-sandbox-..."
}
```

#### POST /api/v1/balance

Get account balance using an access token.

**Request Body:**

```json
{
  "access_token": "access-sandbox-..."
}
```

#### GET /api/v1/health

Check Plaid service health and configuration status.

### Health Checks

#### GET /health

Comprehensive health check including external service connectivity.

#### GET /ping

Simple ping endpoint.

## Configuration

### Sandbox Mode

The API supports separate configuration for production and sandbox environments:

- **Production API Key** (`PLEDGE_TO_API_KEY`): Used for organization data and production donations
- **Sandbox API Key** (`PLEDGE_TO_SANDBOX_API_KEY`): Used for sandbox donations when `USE_SANDBOX_FOR_DONATIONS=true`
- **Donations**: Use sandbox by default (`USE_SANDBOX_FOR_DONATIONS=true`) for safe testing
- **Organizations**: Always use production API to get real organization data
- **Plaid**: Uses sandbox environment by default (`PLAID_ENV=sandbox`) for safe testing

If no sandbox API key is provided, the production key will be used for sandbox operations with a warning.

### Logging

The application uses structured logging with different levels based on the `DEBUG` setting:

- `DEBUG=true`: Debug level logging
- `DEBUG=false`: Info level logging

## Testing

Run the comprehensive test suite:

```bash
python test_api.py
```

This will test all endpoints and provide detailed output.

## Development

### Adding New Routes

1. Create a new router file in `routes/`
2. Import and include it in `main.py`
3. Add corresponding models in `models.py` if needed

### Plaid Integration

The Plaid integration provides bank account connectivity through Plaid Link:

- **Link Token Creation**: Generates tokens for Plaid Link initialization
- **Token Exchange**: Converts public tokens to access tokens
- **Balance Retrieval**: Fetches account balance information
- **Health Monitoring**: Checks Plaid service configuration

The integration supports both iOS and Android platforms with appropriate configuration for each.

### Extending the Pledge Client

The `services/pledge_client.py` file contains the API client. Add new methods here for additional Pledge.to API endpoints.

## Deployment

For production deployment:

1. Set `DEBUG=false` and `USE_SANDBOX_FOR_DONATIONS=false`
2. Configure proper CORS origins in `main.py`
3. Use a production ASGI server like Gunicorn with Uvicorn workers
4. Set up proper logging and monitoring
5. Secure your API key and environment variables

```bash
# Example production command
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
