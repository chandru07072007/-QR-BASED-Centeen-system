# Main Flask Application
# This is the entry point for the backend server

from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from extensions import init_extensions

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend communication
CORS(app)

# Initialize extensions
init_extensions(app)

# Home route
@app.route('/')
def home():
    return jsonify({
        "message": "QR-Based Canteen Management System API",
        "version": "1.0",
        "status": "running"
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Route not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Import and register blueprints after app is fully initialized
def register_blueprints():
    from routes import auth_routes, menu_routes, order_routes, payment_routes, qr_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(menu_routes.bp)
    app.register_blueprint(order_routes.bp)
    app.register_blueprint(payment_routes.bp)
    app.register_blueprint(qr_routes.bp)

if __name__ == '__main__':
    register_blueprints()
    app.run(debug=True, host='0.0.0.0', port=5000)
