# Payment Routes
# Generates UPI payment links

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from config import Config
import urllib.parse

bp = Blueprint('payment', __name__, url_prefix='/api/payment')

@bp.route('/generate-upi', methods=['POST'])
@jwt_required()
def generate_upi_link():
    """
    Generate UPI Payment Link
    Accepts: amount, order_id, customer_name
    Returns: UPI intent link that opens GPay/PhonePe/Paytm
    
    UPI Link Format:
    upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tn=<TRANSACTION_NOTE>
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'amount' not in data:
            return jsonify({"error": "Amount is required"}), 400
        
        amount = float(data['amount'])
        order_id = data.get('order_id', 'N/A')
        customer_name = data.get('customer_name', 'Customer')
        
        # Transaction note
        transaction_note = f"Canteen Order {order_id}"
        
        # Build UPI link
        upi_params = {
            'pa': Config.UPI_ID,  # Payee address (UPI ID)
            'pn': Config.UPI_NAME,  # Payee name
            'am': str(amount),  # Amount
            'cu': 'INR',  # Currency
            'tn': transaction_note  # Transaction note
        }
        
        # Encode parameters
        query_string = urllib.parse.urlencode(upi_params)
        upi_link = f"upi://pay?{query_string}"
        
        return jsonify({
            "success": True,
            "upi_link": upi_link,
            "amount": amount,
            "upi_id": Config.UPI_ID,
            "payee_name": Config.UPI_NAME,
            "message": "UPI link generated successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/verify', methods=['POST'])
@jwt_required()
def verify_payment():
    """
    Payment Verification Endpoint
    In production, this would verify with payment gateway
    For demo, we'll accept transaction_id and mark as success
    """
    try:
        data = request.get_json()
        
        if not all(k in data for k in ('order_id', 'transaction_id')):
            return jsonify({"error": "Missing required fields"}), 400
        
        # In production: Verify with UPI payment gateway
        # For demo: Just return success
        
        return jsonify({
            "success": True,
            "payment_verified": True,
            "transaction_id": data['transaction_id'],
            "message": "Payment verified successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
