# Shared extensions module
# This module holds Flask extensions to avoid circular imports

from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Initialize extensions without app
mongo = PyMongo()
bcrypt = Bcrypt()
jwt = JWTManager()

# This will be set after app is created
db = None

def init_extensions(app):
    """Initialize all extensions with the Flask app"""
    global db
    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    db = mongo.db
