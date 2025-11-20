# MongoDB Models / Schemas
# Defines data structures for User, MenuItem, and Order

from datetime import datetime
from bson import ObjectId

class User:
    """User model for customer registration"""
    
    @staticmethod
    def create(name, email, phone, password_hash):
        return {
            "name": name,
            "email": email,
            "phone": phone,
            "password": password_hash,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
    
    @staticmethod
    def validate_email(email):
        """Basic email validation"""
        return '@' in email and '.' in email

class MenuItem:
    """Menu Item model for food items"""
    
    @staticmethod
    def create(name, description, price, category, image_url, is_available=True):
        return {
            "name": name,
            "description": description,
            "price": float(price),
            "category": category,
            "image_url": image_url,
            "is_available": is_available,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

class Order:
    """Order model for customer orders"""
    
    @staticmethod
    def create(user_id, items, total_amount, table_number=None, split_count=1, payment_status='pending'):
        return {
            "user_id": user_id,
            "items": items,  # List of {item_id, name, price, quantity}
            "total_amount": float(total_amount),
            "per_person_amount": float(total_amount) / split_count if split_count > 1 else float(total_amount),
            "split_count": split_count,
            "table_number": table_number,
            "payment_status": payment_status,  # pending, success, failed
            "order_status": "placed",  # placed, preparing, ready, delivered
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    
    @staticmethod
    def update_payment_status(order_id, status):
        return {
            "payment_status": status,
            "updated_at": datetime.utcnow()
        }
