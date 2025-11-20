# Authentication Routes
# Handles user registration, login, and staff login

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db, bcrypt
from models.models import User
from config import Config

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    """
    User Registration Endpoint
    Accepts: name, email, phone, password
    Returns: success message and JWT token
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('name', 'email', 'phone', 'password')):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if user already exists
        existing_user = db.users.find_one({"email": data['email']})
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409
        
        # Validate email format
        if not User.validate_email(data['email']):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Hash password
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create user
        user = User.create(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            password_hash=password_hash
        )
        
        # Insert into database
        result = db.users.insert_one(user)
        
        # Generate JWT token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            "message": "Registration successful",
            "token": access_token,
            "user": {
                "id": str(result.inserted_id),
                "name": data['name'],
                "email": data['email']
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/login', methods=['POST'])
def login():
    """
    User Login Endpoint
    Accepts: email, password
    Returns: JWT token and user info
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('email', 'password')):
            return jsonify({"error": "Missing email or password"}), 400
        
        # Find user
        user = db.users.find_one({"email": data['email']})
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Check password
        if not bcrypt.check_password_hash(user['password'], data['password']):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Generate JWT token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email']
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/staff-login', methods=['POST'])
def staff_login():
    """
    Staff Login Endpoint
    Accepts: username, password
    Default credentials: admin123 / 1234
    Returns: JWT token with staff role
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('username', 'password')):
            return jsonify({"error": "Missing username or password"}), 400
        
        # Check credentials
        if data['username'] == Config.STAFF_USERNAME and data['password'] == Config.STAFF_PASSWORD:
            # Generate JWT token with staff identifier
            access_token = create_access_token(
                identity='staff_admin',
                additional_claims={"role": "staff"}
            )
            
            return jsonify({
                "message": "Staff login successful",
                "token": access_token,
                "staff": {
                    "username": Config.STAFF_USERNAME,
                    "role": "admin"
                }
            }), 200
        else:
            return jsonify({"error": "Invalid staff credentials"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """
    Verify JWT Token
    Returns: Current user/staff identity
    """
    try:
        current_user = get_jwt_identity()
        return jsonify({
            "valid": True,
            "user_id": current_user
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401
