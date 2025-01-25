import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from database_models import db
from api import register_api


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'defaultsecret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI')
    if not app.config['SQLALCHEMY_DATABASE_URI']:
        raise ValueError("DB_URI is not set or invalid in the environment variables.")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()
    register_api(app)

    return app

if __name__ == '__main__':
    app = create_app()
    print(app.url_map)
    app.run(debug=True, host='0.0.0.0', port=5000)

