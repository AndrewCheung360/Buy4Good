#!/bin/bash

# Start script for Buy4Good Backend API

echo "Starting Buy4Good Backend API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
echo "Installing dependencies..."
pip install --upgrade -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file and set your PLEDGE_TO_API_KEY"
fi

# Start the server using the modern FastAPI CLI
echo "Starting FastAPI server with modern CLI..."
echo "Available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
fastapi run main.py --host 0.0.0.0 --port 8000
