import sqlite3

class Models:
    def __init__(self):
        self.database_file = "database.db"
        self.create_database()

    def create_database(self):
        """Initialize the database and create tables if they do not exist."""
        create_media_files_query = """
        CREATE TABLE IF NOT EXISTS media_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_data BLOB NOT NULL
        );
        """
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(create_media_files_query)
            conn.commit()

    def save_file(self, filename, file_type, file_data):
        """Save a file as a binary blob in the database."""
        insert_file_query = """
        INSERT INTO media_files (filename, file_type, file_data) VALUES (?, ?, ?);
        """
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(insert_file_query, (filename, file_type, file_data))
            conn.commit()
            return cursor.lastrowid

    def retrieve_file(self, file_id):
        """Retrieve a file's metadata and binary data from the database."""
        select_file_query = """
        SELECT id, filename, file_type, file_data FROM media_files WHERE id = ?;
        """
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(select_file_query, (file_id,))
            return cursor.fetchone()

    def delete_file(self, file_id):
        """Delete a file from the database."""
        delete_file_query = """
        DELETE FROM media_files WHERE id = ?;
        """
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(delete_file_query, (file_id,))
            conn.commit()

    def count_files(self):
        """Count the number of files in the database."""
        count_files_query = """
        SELECT COUNT(*) FROM media_files;
        """
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(count_files_query)
            return cursor.fetchone()[0]

    def get_all_files(self):
        """Retrieve all files metadata from the database."""
        query = """
        SELECT id, filename, file_type FROM media_files;
        """
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            files = cursor.fetchall()
        return [{"id": row[0], "filename": row[1], "file_type": row[2]} for row in files]
