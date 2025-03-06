import os
from flask_migrate import upgrade
from alembic.config import Config
from alembic import command
from ..app import create_app  # Replace with your actual app module

app = create_app()

with app.app_context():
    if not os.path.exists("migrations"):
        if not os.path.exists("alembic.ini"):
            raise RuntimeError("alembic.ini not found. Run 'flask db init' or create one manually.")

        alembic_cfg = Config("alembic.ini")
        command.init(alembic_cfg, "migrations")
        print("Initialized migrations folder.")

    upgrade()
    print("Database upgraded.")
