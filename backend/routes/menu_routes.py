# Menu Routes
# Handles menu item CRUD operations (staff) and menu viewing (users)

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from bson import ObjectId
from extensions import db
from models.models import MenuItem
from datetime import datetime

bp = Blueprint('menu', __name__, url_prefix='/api/menu')

@bp.route('/items', methods=['GET'])
def get_menu_items():
    """
    Get All Menu Items
    Public endpoint - no authentication required
    Returns: List of all available menu items
    """
    try:
        # Fetch all menu items
        items = list(db.menu_items.find({"is_available": True}))
        
        # Convert ObjectId to string
        for item in items:
            item['_id'] = str(item['_id'])
        
        return jsonify({
            "success": True,
            "items": items
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/items/<item_id>', methods=['GET'])
def get_menu_item(item_id):
    """
    Get Single Menu Item by ID
    """
    try:
        item = db.menu_items.find_one({"_id": ObjectId(item_id)})
        
        if not item:
            return jsonify({"error": "Item not found"}), 404
        
        item['_id'] = str(item['_id'])
        
        return jsonify({
            "success": True,
            "item": item
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/items', methods=['POST'])
@jwt_required()
def add_menu_item():
    """
    Add New Menu Item (Staff Only)
    Requires JWT token with staff role
    """
    try:
        # Check if user is staff
        claims = get_jwt()
        if claims.get('role') != 'staff':
            return jsonify({"error": "Unauthorized - Staff only"}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'description', 'price', 'category', 'image_url']
        if not all(k in data for k in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create menu item
        item = MenuItem.create(
            name=data['name'],
            description=data['description'],
            price=data['price'],
            category=data['category'],
            image_url=data['image_url'],
            is_available=data.get('is_available', True)
        )
        
        # Insert into database
        result = db.menu_items.insert_one(item)
        
        return jsonify({
            "message": "Menu item added successfully",
            "item_id": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/items/<item_id>', methods=['PUT'])
@jwt_required()
def update_menu_item(item_id):
    """
    Update Menu Item (Staff Only)
    """
    try:
        # Check if user is staff
        claims = get_jwt()
        if claims.get('role') != 'staff':
            return jsonify({"error": "Unauthorized - Staff only"}), 403
        
        data = request.get_json()
        
        # Prepare update data
        update_data = {}
        allowed_fields = ['name', 'description', 'price', 'category', 'image_url', 'is_available']
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        update_data['updated_at'] = datetime.utcnow()
        
        # Update item
        result = db.menu_items.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Item not found"}), 404
        
        return jsonify({
            "message": "Menu item updated successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/items/<item_id>', methods=['DELETE'])
@jwt_required()
def delete_menu_item(item_id):
    """
    Delete Menu Item (Staff Only)
    Soft delete - marks as unavailable
    """
    try:
        # Check if user is staff
        claims = get_jwt()
        if claims.get('role') != 'staff':
            return jsonify({"error": "Unauthorized - Staff only"}), 403
        
        # Soft delete - mark as unavailable
        result = db.menu_items.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": {"is_available": False, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Item not found"}), 404
        
        return jsonify({
            "message": "Menu item deleted successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Get All Unique Categories
    """
    try:
        categories = db.menu_items.distinct("category")
        return jsonify({
            "success": True,
            "categories": categories
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
