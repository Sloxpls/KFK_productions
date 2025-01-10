CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    data BLOB NOT NULL,
    title TEXT NOT NULL,
    genre TEXT,
    duration INTEGER,
    file_size INTEGER,
    added_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
