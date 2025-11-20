# Order Routes
# Handles order creation and order management

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from bson import ObjectId
from extensions import db
from models.models import Order
from datetime import datetime

bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    """
    Create New Order
    Requires JWT authentication
    Accepts: items[], total_amount, table_number, split_count
    """
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('items', 'total_amount')):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Validate items array
        if not isinstance(data['items'], list) or len(data['items']) == 0:
            return jsonify({"error": "Items must be a non-empty array"}), 400
        
        # Create order
        order = Order.create(
            user_id=current_user,
            items=data['items'],
            total_amount=data['total_amount'],
            table_number=data.get('table_number'),
            split_count=data.get('split_count', 1),
            payment_status='pending'
        )
        
        # Insert into database
        result = db.orders.insert_one(order)
        
        return jsonify({
            "message": "Order created successfully",
            "order_id": str(result.inserted_id),
            "order": {
                "id": str(result.inserted_id),
                "total_amount": order['total_amount'],
                "per_person_amount": order['per_person_amount'],
                "split_count": order['split_count']
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """
    Get Orders
    - If user: returns their orders
    - If staff: returns all orders
    """
    try:
        current_user = get_jwt_identity()
        claims = get_jwt()
        
        # Check if staff
        if claims.get('role') == 'staff':
            # Get all orders for staff
            orders = list(db.orders.find().sort("created_at", -1))
        else:
            # Get user's orders only
            orders = list(db.orders.find({"user_id": current_user}).sort("created_at", -1))
        
        # Convert ObjectId to string and format dates
        for order in orders:
            order['_id'] = str(order['_id'])
            order['created_at'] = order['created_at'].isoformat()
            order['updated_at'] = order['updated_at'].isoformat()
        
        return jsonify({
            "success": True,
            "orders": orders
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """
    Get Single Order by ID
    """
    try:
        current_user = get_jwt_identity()
        claims = get_jwt()
        
        order = db.orders.find_one({"_id": ObjectId(order_id)})
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        # Check authorization (user can only see their own orders, staff can see all)
        if claims.get('role') != 'staff' and order['user_id'] != current_user:
            return jsonify({"error": "Unauthorized"}), 403
        
        order['_id'] = str(order['_id'])
        order['created_at'] = order['created_at'].isoformat()
        order['updated_at'] = order['updated_at'].isoformat()
        
        return jsonify({
            "success": True,
            "order": order
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/<order_id>/payment', methods=['PUT'])
@jwt_required()
def update_payment_status(order_id):
    """
    Update Payment Status
    Accepts: payment_status (pending, success, failed)
    """
    try:
        data = request.get_json()
        
        if 'payment_status' not in data:
            return jsonify({"error": "Missing payment_status"}), 400
        
        # Update payment status
        update_data = Order.update_payment_status(order_id, data['payment_status'])
        
        result = db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Order not found"}), 404
        
        return jsonify({
            "message": "Payment status updated successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/<order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """
    Update Order Status (Staff Only)
    Accepts: order_status (placed, preparing, ready, delivered)
    """
    try:
        claims = get_jwt()
        if claims.get('role') != 'staff':
            return jsonify({"error": "Unauthorized - Staff only"}), 403
        
        data = request.get_json()
        
        if 'order_status' not in data:
            return jsonify({"error": "Missing order_status"}), 400
        
        # Update order status
        result = db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {
                "order_status": data['order_status'],
                "updated_at": datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Order not found"}), 404
        
        return jsonify({
            "message": "Order status updated successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
