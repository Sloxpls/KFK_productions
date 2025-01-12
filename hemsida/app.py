from flask import Flask, render_template
from api.routes import (
    tracks_routes,
    songs_routes,
    playlists_routes,
    producers_routes,
    images_routes,
    videos_routes,
    socials_routes
)
from db.models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Register API routes
app.register_blueprint(tracks_routes, url_prefix='/api')
app.register_blueprint(songs_routes, url_prefix='/api')
app.register_blueprint(playlists_routes, url_prefix='/api')
app.register_blueprint(producers_routes, url_prefix='/api')
app.register_blueprint(images_routes, url_prefix='/api')
app.register_blueprint(videos_routes, url_prefix='/api')
app.register_blueprint(socials_routes, url_prefix='/api')

print("Registered routes:")
for rule in app.url_map.iter_rules():
    print(f"{rule} -> {rule.methods}")

@app.route('/')
def index():
    return render_template('songs.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/media')
def media():
    return render_template('media.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
