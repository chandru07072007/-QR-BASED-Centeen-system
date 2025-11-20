# Configuration file for Flask app
# Contains all environment variables and settings

import os
from datetime import timedelta

class Config:
    # MongoDB Configuration
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/canteen_db'
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'your-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # UPI Configuration
    UPI_ID = os.environ.get('UPI_ID') or 'chandrupalanisamyaids@okaxis'
    UPI_NAME = os.environ.get('UPI_NAME') or 'Chandru P'
    
    # Staff Credentials (hardcoded as per requirements)
    STAFF_USERNAME = 'admin123'
    STAFF_PASSWORD = '1234'
    
    # Other configurations
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    DEBUG = True
