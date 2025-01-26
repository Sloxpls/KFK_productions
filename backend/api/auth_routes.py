import os
from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

USERNAME = "admin"
PASSWORD = "kfk"
print(USERNAME, PASSWORD)


@auth_bp.route("/", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    print(USERNAME, PASSWORD)

    if username == USERNAME and password == PASSWORD:
        print(USERNAME, PASSWORD)
        return jsonify({"message": "Login successful!"}), 200
    else:
        print(USERNAME, PASSWORD)
        return jsonify({"message": "Invalid credentials."}), 401