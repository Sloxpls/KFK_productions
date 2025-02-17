from functools import wraps
from flask import request, jsonify
import os
import jwt

JWT_SECRET = os.environ.get('JWT_SECRET')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        if not token:
            return jsonify({"message": "Permission denied: Token is missing!"}), 403
        try:
            jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        except jwt.PyJWTError:
            return jsonify({"message": "Permission denied: Token is invalid!"}), 403
        return f(*args, **kwargs)
    return decorated