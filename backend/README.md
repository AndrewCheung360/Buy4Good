# Buy4Good Backend API

A FastAPI-based backend server for handling donations, organization data, transaction simulation, and affiliate network webhooks through the Pledge.to API.

## Features

- **Donations**: Create donations to nonprofit organizations (using sandbox for testing)
- **Organizations**: Get organization details and browse available nonprofits
- **Transaction Simulation**: Mock transaction processing for affiliate network testing
- **Webhook Handling**: Process incoming webhooks from affiliate networks
- **FastAPI Framework**: Automatic OpenAPI documentation and validation
- **Modular Architecture**: Organized route modules for easy extension
- **Error Handling**: Comprehensive error handling and logging
- **Health Checks**: Multiple health check endpoints
- **CORS Support**: Ready for frontend integration

## Project Structure

```
backend/
├── main.py                    # FastAPI application entry point
├── config.py                  # Configuration and settings
├── models.py                  # Pydantic models for request/response
├── requirements.txt           # Python dependencies
├── .env                      # Environment variables
├── .env.example              # Environment template  
├── .gitignore                # Git ignore patterns
├── start.sh                  # Startup script
├── test_api.py               # Comprehensive API tests
├── README.md                 # This file
├── routes/                   # Route modules
│   ├── __init__.py
│   ├── donations.py          # Donation endpoints
│   ├── organizations.py      # Organization endpoints
│   ├── transactions.py       # Transaction simulation & webhooks
│   └── health.py            # Health check endpoints
└── services/                 # Service modules
    ├── __init__.py
    └── pledge_client.py      # Enhanced Pledge.to API client
```

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
# Pledge.to API Configuration
PLEDGE_TO_API_KEY=your_production_api_key_here
PLEDGE_TO_SANDBOX_API_KEY=your_sandbox_api_key_here
PLEDGE_TO_BASE_URL=https://api.pledge.to
PLEDGE_TO_SANDBOX_URL=https://api-staging.pledge.to
USE_SANDBOX_FOR_DONATIONS=true

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

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
  "metadata": {"source": "affiliate"}
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
