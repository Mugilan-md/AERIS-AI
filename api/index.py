"""
AERIS AI - Vercel Serverless Entry Point
Routes all /api/* requests to the FastAPI application.
Vercel Python Runtime executes this as an ASGI serverless function.
"""
import sys
import os

# Add the backend directory to the Python path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the FastAPI app - Vercel detects 'app' as the ASGI handler
from app.main import app
