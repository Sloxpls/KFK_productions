import sqlite3
import os

class Models:
    def __init__(self):
        self.database_file = "database.db"
        self.create_database()

    def load_query(self, query_file):
        with open(query_file, 'r') as file:
            return file.read()

    def create_database(self):
        """Initialize the database and create tables if they do not exist."""
        query = self.load_query("queries/create_media_files.sql")
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            conn.commit()

    def save_file(self, filename, file_type, file_data):
        """Save a file as a binary blob in the database."""
        query = self.load_query("queries/insert_file.sql")
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(query, (filename, file_type, file_data))
            conn.commit()
            return cursor.lastrowid

    def retrieve_file(self, file_id):
        """Retrieve a file's metadata and binary data from the database."""
        query = self.load_query("queries/select_file.sql")
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(query, (file_id,))
            return cursor.fetchone()
