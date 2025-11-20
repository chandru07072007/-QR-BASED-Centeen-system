# Quick Setup Guide - Canteen Management System

## 🚀 Quick Start (5 Minutes)

### Step 1: Start MongoDB
```powershell
# Open Terminal 1
mongod
```

### Step 2: Setup and Run Backend
```powershell
# Open Terminal 2
cd "c:\Users\Chandru P\OneDrive\Documents\centeen\backend"

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install -r requirements.txt

# Seed database with sample data (first time only)
python seed_data.py

# Run backend server
python app.py
```

### Step 3: Setup and Run Frontend
```powershell
# Open Terminal 3
cd "c:\Users\Chandru P\OneDrive\Documents\centeen\frontend"

# Install dependencies (first time only)
npm install

# Start React app
npm start
```

## ✅ Verify Installation

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- MongoDB: localhost:27017

## 🔑 Login Credentials

### Staff Login
- Username: `admin123`
- Password: `1234`
- URL: http://localhost:3000/staff-login

### User Login
- Register new account first
- URL: http://localhost:3000/register

## 📱 Testing Flow

1. **Register as User** → Create account
2. **Browse Menu** → View food items
3. **Add to Cart** → Select items
4. **Split Bill** (Optional) → Divide among people
5. **Proceed to Payment** → Generate UPI link
6. **Staff Login** → Manage menu & orders

## 🆘 Common Issues

### Port 5000 already in use:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB not running:
```powershell
net start MongoDB
```

### Virtual environment issues:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📞 Need Help?
Check the full README.md for detailed documentation.
