# 🍽️ QR-Based Canteen Management System

A complete full-stack web application for canteen management with QR code integration, built using **React**, **Flask**, and **MongoDB**.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Default Credentials](#default-credentials)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### User Features
- 📱 User Registration & Login with JWT Authentication
- 🏠 Home page with canteen information and banners
- 🍔 Browse menu items by category
- 🛒 Add items to cart with quantity management
- 💰 Split bill functionality (divide total among multiple people)
- 💳 UPI payment integration (GPay/PhonePe/Paytm)
- 📲 QR code scanning for table-based ordering
- 📦 Order history and tracking

### Staff Features
- 🔐 Staff login with hardcoded credentials
- ➕ Add, edit, and delete menu items
- 📋 View all customer orders in real-time
- 🔄 Update order status (Placed → Preparing → Ready → Delivered)
- 📱 Generate QR codes for tables
- 📊 Order management dashboard

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI Library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management (Cart & Auth)
- **CSS3** - Styling

### Backend
- **Python 3.8+** - Programming language
- **Flask 2.3** - Web framework
- **Flask-PyMongo** - MongoDB integration
- **Flask-JWT-Extended** - JWT authentication
- **Flask-Bcrypt** - Password hashing
- **Flask-CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database

### Additional Libraries
- **qrcode** - QR code generation
- **Pillow** - Image processing

---

## 🏗️ System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │ ──HTTP─→│   Flask     │ ──────→ │   MongoDB   │
│  Frontend   │ ←─JSON──│   Backend   │ ←──────  │  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │
      │                        │
      ├─ User Interface        ├─ REST APIs
      ├─ Cart Management       ├─ JWT Auth
      ├─ Authentication        ├─ Payment Logic
      └─ QR Scanning           └─ QR Generation
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **Python** (v3.8 or higher) - [Download](https://www.python.org/)
3. **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/)
4. **Git** (optional) - [Download](https://git-scm.com/)

### Verify Installation

```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Python version
python --version

# Check MongoDB status
mongod --version
```

---

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to Project

```powershell
cd "c:\Users\Chandru P\OneDrive\Documents\centeen"
```

### Step 2: Setup Backend

#### 2.1 Create Python Virtual Environment

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2.2 Install Python Dependencies

```powershell
# Install all required packages
pip install -r requirements.txt
```

#### 2.3 Start MongoDB

```powershell
# Open a new PowerShell terminal and run:
mongod

# Or if MongoDB is installed as a service:
net start MongoDB
```

#### 2.4 Seed Database with Sample Data

```powershell
# Still in backend directory with venv activated
python seed_data.py
```

This will add 5 sample menu items to the database.

### Step 3: Setup Frontend

```powershell
# Open a new terminal
cd "c:\Users\Chandru P\OneDrive\Documents\centeen\frontend"

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### Terminal 1: Start MongoDB (if not running as service)

```powershell
mongod
```

### Terminal 2: Start Backend Server

```powershell
cd "c:\Users\Chandru P\OneDrive\Documents\centeen\backend"

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run Flask server
python app.py
```

Backend will run on: **http://localhost:5000**

### Terminal 3: Start Frontend Server

```powershell
cd "c:\Users\Chandru P\OneDrive\Documents\centeen\frontend"

# Start React development server
npm start
```

Frontend will run on: **http://localhost:3000**

Your browser should automatically open to http://localhost:3000

---

## 🔑 Default Credentials

### Staff Login
- **Username:** `admin123`
- **Password:** `1234`

### User Login
Users need to register first. No default user account is provided.

---

## 📖 Usage Guide

### For Users

1. **Register/Login**
   - Go to http://localhost:3000
   - Click "Register here" to create an account
   - Fill in name, email, phone, and password
   - After registration, you'll be automatically logged in

2. **Browse Menu**
   - From home page, click "View Menu & Order Now"
   - Filter items by category
   - View item details, prices, and images

3. **Add to Cart**
   - Click "Add to Cart" to add items
   - Click "Buy Now" to add and go directly to cart
   - Use +/- buttons to adjust quantities

4. **Checkout**
   - Click "Proceed to Payment" for full amount
   - OR click "Split Bill" to divide among multiple people
   - Enter number of people and see per-person amount

5. **Payment**
   - Click "Pay Now" to generate UPI link
   - Opens GPay/PhonePe/Paytm (on mobile)
   - Click "Mark as Paid" for demo purposes

6. **QR Code Ordering**
   - Scan QR code at table
   - Opens menu with table number
   - Order is linked to that table

### For Staff

1. **Staff Login**
   - Go to http://localhost:3000/staff-login
   - Use credentials: admin123 / 1234

2. **Menu Management**
   - Click "Menu Management" tab
   - Add new items with image URL, price, category
   - Edit existing items
   - Delete or mark items as unavailable

3. **Order Management**
   - Click "Orders" tab
   - View all customer orders
   - Update order status dropdown
   - See payment status and split details

4. **QR Code Generation**
   - Click "QR Codes" tab
   - Enter number of tables
   - Click "Generate QR Codes"
   - Download individual QR codes for each table

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
User login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/staff-login`
Staff login.

**Request Body:**
```json
{
  "username": "admin123",
  "password": "1234"
}
```

### Menu Endpoints

#### GET `/api/menu/items`
Get all menu items (public endpoint).

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "_id": "...",
      "name": "Masala Dosa",
      "description": "...",
      "price": 60,
      "category": "South Indian",
      "image_url": "...",
      "is_available": true
    }
  ]
}
```

#### POST `/api/menu/items` (Staff Only)
Add new menu item.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Veg Biryani",
  "description": "Fragrant rice with vegetables",
  "price": 120,
  "category": "Main Course",
  "image_url": "https://...",
  "is_available": true
}
```

#### PUT `/api/menu/items/<item_id>` (Staff Only)
Update menu item.

#### DELETE `/api/menu/items/<item_id>` (Staff Only)
Delete menu item (soft delete).

### Order Endpoints

#### POST `/api/orders/`
Create new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "item_id": "...",
      "name": "Masala Dosa",
      "price": 60,
      "quantity": 2
    }
  ],
  "total_amount": 126,
  "split_count": 2,
  "table_number": "5"
}
```

#### GET `/api/orders/`
Get orders (user sees their orders, staff sees all).

#### PUT `/api/orders/<order_id>/payment`
Update payment status.

#### PUT `/api/orders/<order_id>/status` (Staff Only)
Update order status.

### Payment Endpoints

#### POST `/api/payment/generate-upi`
Generate UPI payment link.

**Request Body:**
```json
{
  "amount": 126,
  "order_id": "...",
  "customer_name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "upi_link": "upi://pay?pa=canteen@upi&pn=Canteen&am=126&cu=INR&tn=..."
}
```

### QR Code Endpoints

#### POST `/api/qr/generate`
Generate QR code for single table.

**Request Body:**
```json
{
  "table_number": 5,
  "base_url": "http://localhost:3000"
}
```

#### POST `/api/qr/generate-multiple`
Generate QR codes for multiple tables.

**Request Body:**
```json
{
  "table_count": 10,
  "base_url": "http://localhost:3000"
}
```

---

## 📁 Project Structure

```
centeen/
│
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── requirements.txt       # Python dependencies
│   ├── seed_data.py          # Database seeding script
│   │
│   ├── models/
│   │   └── models.py         # MongoDB models (User, MenuItem, Order)
│   │
│   └── routes/
│       ├── auth_routes.py    # Authentication endpoints
│       ├── menu_routes.py    # Menu CRUD operations
│       ├── order_routes.py   # Order management
│       ├── payment_routes.py # UPI payment generation
│       └── qr_routes.py      # QR code generation
│
└── frontend/
    ├── package.json          # Node.js dependencies
    ├── public/
    │   └── index.html       # HTML template
    │
    └── src/
        ├── App.js            # Main React component
        ├── App.css           # Global styles
        ├── index.js          # React entry point
        │
        ├── components/
        │   ├── Auth/
        │   │   ├── Login.js
        │   │   ├── Register.js
        │   │   ├── StaffLogin.js
        │   │   └── Auth.css
        │   │
        │   ├── User/
        │   │   ├── Home.js
        │   │   ├── Menu.js
        │   │   ├── Cart.js
        │   │   ├── Payment.js
        │   │   └── User.css
        │   │
        │   ├── Staff/
        │   │   ├── StaffDashboard.js
        │   │   └── Staff.css
        │   │
        │   └── Common/
        │       └── PrivateRoute.js
        │
        ├── context/
        │   ├── AuthContext.js    # Authentication state
        │   └── CartContext.js    # Shopping cart state
        │
        └── utils/
            └── api.js            # Axios API configuration
```

---

## 🔧 Configuration

### Backend Configuration (backend/config.py)

```python
# MongoDB URI
MONGO_URI = 'mongodb://localhost:27017/canteen_db'

# JWT Secret Key (change in production)
JWT_SECRET_KEY = 'your-secret-key-change-in-production'

# UPI Configuration
UPI_ID = 'canteen@upi'
UPI_NAME = 'Canteen Payment'

# Staff Credentials
STAFF_USERNAME = 'admin123'
STAFF_PASSWORD = '1234'
```

### Frontend Configuration

Create `.env` file in frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Issue: MongoDB connection failed

**Solution:**
- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check MongoDB URI in `backend/config.py`
- Verify MongoDB is listening on port 27017

### Issue: CORS error in browser

**Solution:**
- Backend already includes Flask-CORS
- Ensure backend is running on port 5000
- Check browser console for detailed error

### Issue: "Module not found" error in Python

**Solution:**
```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: React app won't start

**Solution:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

### Issue: Port already in use

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## 🎨 Sample Menu Items

The seed script adds these items:

1. **Masala Dosa** - ₹60 (South Indian)
2. **Veg Biryani** - ₹120 (Main Course)
3. **Paneer Butter Masala** - ₹150 (Main Course)
4. **Cold Coffee** - ₹50 (Beverages)
5. **Samosa (2 pcs)** - ₹30 (Snacks)

---

## 📱 UPI Payment Integration

The system generates UPI deep links in this format:

```
upi://pay?pa=canteen@upi&pn=Canteen&am=126&cu=INR&tn=Order123
```

**Parameters:**
- `pa` - Payee Address (UPI ID)
- `pn` - Payee Name
- `am` - Amount
- `cu` - Currency (INR)
- `tn` - Transaction Note

When clicked on mobile, this opens:
- Google Pay (GPay)
- PhonePe
- Paytm
- Any UPI app

---

## 🔒 Security Notes

**For Production Deployment:**

1. Change JWT secret key in `config.py`
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Implement proper password policies
5. Add rate limiting to APIs
6. Use strong staff credentials
7. Implement payment gateway verification
8. Add input validation and sanitization

---

## 📝 License

This project is created for educational purposes.

---

## 👨‍💻 Developer Notes

- All API calls are commented for easy understanding
- Context API is used for state management (no Redux needed)
- JWT tokens are stored in localStorage
- Cart data persists across sessions
- Mobile-responsive design
- Error handling included in all API calls

---

## 📞 Support

For issues or questions:

www.linkedin.com/in/chandru-p-393800374
---

## 🎉 Features to Add (Future Enhancements)

- [ ] Real-time order updates with WebSockets
- [ ] Email notifications for orders
- [ ] Rating and review system
- [ ] Order history with filters
- [ ] Multiple payment methods
- [ ] Delivery tracking
- [ ] Loyalty points system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

---

**Happy Coding! 🚀**
