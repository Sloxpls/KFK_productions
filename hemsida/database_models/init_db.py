from db.models import db
from app import app  # Importera din Flask-app

# Initiera databasen
with app.app_context():
    db.create_all()
    print("Database initialized successfully!")
