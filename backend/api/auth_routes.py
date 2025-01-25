import os
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

USERNAME = os.environ.get("USERNAMEKFK", "default_admin")
PASSWORD = os.environ.get("PASSWORDKFK", "default_password")
PASSWORD_HASH = generate_password_hash(PASSWORD)



@auth_bp.route("/", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    if username == USERNAME and check_password_hash(PASSWORD_HASH, password):
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid credentials."}), 401