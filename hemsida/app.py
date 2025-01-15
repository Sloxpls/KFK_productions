import os

from flask import Flask, render_template, request, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from hemsida.api.routes import *


app = Flask(__name__)

# ------------------------------------------------------------------------------
# Config
# ------------------------------------------------------------------------------
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music.database_models'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)
# ------------------------------------------------------------------------------
# API routes
# ------------------------------------------------------------------------------


app.register_blueprint(tracks_routes, url_prefix='/api')
app.register_blueprint(songs_routes, url_prefix='/api')
app.register_blueprint(playlists_routes, url_prefix='/api')
app.register_blueprint(producers_routes, url_prefix='/api')
app.register_blueprint(images_routes, url_prefix='/api')
app.register_blueprint(videos_routes, url_prefix='/api')
app.register_blueprint(socials_routes, url_prefix='/api')
app.register_blueprint(media_routes, url_prefix='/api')

# ------------------------------------------------------------------------------
# Credentials
# ------------------------------------------------------------------------------
SHARED_USERNAME = os.environ.get('USERNAME')
SHARED_PASSWORD = os.environ.get('PASSWORD')

# ------------------------------------------------------------------------------
# Login Route
# ------------------------------------------------------------------------------
@app.route('/', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')

    if username == SHARED_USERNAME and password == SHARED_PASSWORD:
        session['logged_in'] = True
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/', methods=['GET'])
def show_login_form():
    return render_template('login.html')


# ------------------------------------------------------------------------------
# Require Login for Certain Routes
# ------------------------------------------------------------------------------
@app.before_request
def require_login():
    if request.path.startswith('/site'):
        if not session.get('logged_in'):
            return jsonify({"message": "Unauthorized. Please log in."}), 401

    if request.path.startswith('/api'):
         if not session.get('logged_in'):
             return jsonify({"message": "Unauthorized. Please log in."}), 401


# ------------------------------------------------------------------------------
# Site Routes
# ------------------------------------------------------------------------------
@app.route('/site/songs')
def site_index():
    return render_template('songs.html')

@app.route('/site/upload')
def upload():
    return render_template('upload.html')

@app.route('/site/media')
def media():
    return render_template('media.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
