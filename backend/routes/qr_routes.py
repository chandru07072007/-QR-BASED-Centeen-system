# QR Code Routes
# Generates QR codes for tables

from flask import Blueprint, request, jsonify, send_file
import qrcode
from io import BytesIO
import base64

bp = Blueprint('qr', __name__, url_prefix='/api/qr')

@bp.route('/generate', methods=['POST'])
def generate_qr_code():
    """
    Generate QR Code for Table
    Accepts: table_number, base_url (optional)
    Returns: QR code image as base64
    
    QR Code contains URL: http://localhost:3000/order?table=<table_number>
    """
    try:
        data = request.get_json()
        
        if 'table_number' not in data:
            return jsonify({"error": "Table number is required"}), 400
        
        table_number = data['table_number']
        base_url = data.get('base_url', 'http://localhost:3000')
        
        # Create URL for QR code
        order_url = f"{base_url}/order?table={table_number}"
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(order_url)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return jsonify({
            "success": True,
            "table_number": table_number,
            "qr_url": order_url,
            "qr_image": f"data:image/png;base64,{img_base64}",
            "message": "QR code generated successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/generate-multiple', methods=['POST'])
def generate_multiple_qr():
    """
    Generate Multiple QR Codes for Multiple Tables
    Accepts: table_count or table_numbers[]
    Returns: Array of QR codes
    """
    try:
        data = request.get_json()
        base_url = data.get('base_url', 'http://localhost:3000')
        
        qr_codes = []
        
        # Generate for specific table numbers
        if 'table_numbers' in data:
            table_numbers = data['table_numbers']
        # Or generate for count
        elif 'table_count' in data:
            table_count = int(data['table_count'])
            table_numbers = list(range(1, table_count + 1))
        else:
            return jsonify({"error": "Provide either table_numbers or table_count"}), 400
        
        # Generate QR for each table
        for table_num in table_numbers:
            order_url = f"{base_url}/order?table={table_num}"
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(order_url)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            buffer.seek(0)
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            qr_codes.append({
                "table_number": table_num,
                "qr_url": order_url,
                "qr_image": f"data:image/png;base64,{img_base64}"
            })
        
        return jsonify({
            "success": True,
            "count": len(qr_codes),
            "qr_codes": qr_codes
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
