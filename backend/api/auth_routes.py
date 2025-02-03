import os
from flask import Blueprint, request, jsonify
import bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import jwt
import datetime
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__)

ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME')
ADMIN_PW_HASH = os.environ.get('ADMIN_PW_HASH').encode()
JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_EXPIRATION = datetime.timedelta(minutes=15)

limiter = Limiter(key_func=get_remote_address)
login_limiter = limiter.shared_limit("5 per minute", scope="login")

def validate_credentials(username, password):
    try:
        user_valid = username == ADMIN_USERNAME
        pass_valid = bcrypt.checkpw(password.encode(), ADMIN_PW_HASH)
        return user_valid and pass_valid
    except Exception:
        return False

@auth_bp.route("/login", methods=["POST"])
@login_limiter
def login():
    if not request.is_json:
        return jsonify({"error": "Invalid content type"}), 400

    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    print(password, username)

    if not validate_credentials(username, password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        'sub': 'admin',
        'iat': datetime.datetime.utcnow(),
        'exp': datetime.datetime.utcnow() + JWT_EXPIRATION
    }, JWT_SECRET, algorithm='HS256')

    return jsonify({
        "access_token": token,
        "token_type": "bearer",
        "expires_in": JWT_EXPIRATION.total_seconds()
    }), 200

@auth_bp.route("/validate", methods=["POST"])
def validate():

    token = request.headers.get('Authorization', '').split('Bearer ')[-1]
    try:
        jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return jsonify({"valid": True}), 200
    except jwt.PyJWTError:
        return jsonify({"valid": False}), 401