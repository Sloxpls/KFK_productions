import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from database_models import db
from api import register_api

def create_app():
    """Factory function to create and configure the Flask application."""
    # Load environment variables
    load_dotenv()

    app = Flask(__name__)

    # App config
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'defaultsecret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DB_URI',
        'postgresql://myuser:mypassword@database:5432/mydb'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize db
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # Register your other blueprints
    register_api(app)

    # ---------------------------------------------------------
    # Define the login route INSIDE create_app
    # ---------------------------------------------------------
    @app.route("/", methods=["POST"])
    def login():
        data = request.json or {}
        username = data.get("username")
        password = data.get("password")

        if username == "admin" and password == "secret":
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"message": "Invalid credentials."}), 401

    return app

# Only run the server if this file is called directly
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
