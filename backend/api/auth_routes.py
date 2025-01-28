import os
from flask import Blueprint, request, jsonify
import bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', '')
ADMIN_PW_HASH = os.environ.get('ADMIN_PW_HASH', '').encode()
JWT_SECRET = os.environ.get('JWT_SECRET', os.urandom(32).hex())
JWT_EXPIRATION = datetime.timedelta(minutes=15)

limiter = Limiter(key_func=get_remote_address)
login_limiter = limiter.shared_limit("5 per minute", scope="login")


def validate_credentials(username, password):
    try:
        user_valid = bcrypt.checkpw(username.encode(), ADMIN_USERNAME.encode())
        pass_valid = bcrypt.checkpw(password.encode(), ADMIN_PW_HASH)
        return user_valid and pass_valid
    except:
        return False


@auth_bp.route("/login", methods=["POST"])
@login_limiter
def login():
    if not request.is_json:
        return jsonify({"error": "Invalid content type"}), 400

    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    error_response = {"error": "Invalid credentials"}, 401

    if not (8 <= len(password) <= 128) or not (3 <= len(username) <= 30):
        return error_response

    if not validate_credentials(username, password):
        return error_response

    token = jwt.encode({
        'sub': 'admin',
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