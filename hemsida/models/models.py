import os
import sqlite3
database_file = "database.db"



class Models:
    def __init__(self):
        self.database_file = "database.db"

        self.create_database()
        self.connection_test()
        self.create_table()

    def create_database(self):
        if not os.path.exists(self.database_file):
            connection = sqlite3.connect(database_file)
            cursor = connection.cursor()

    def create_table(self):
        try:
            with sqlite3.connect(self.database_file) as conn:
                # create a cursor
                cursor = conn.cursor()

                # execute statements
                for statement in sql_statements:
                    cursor.execute(statement)

                # commit the changes
                conn.commit()

                print("Tables created successfully.")
        except sqlite3.OperationalError as e:
            print("Failed to create tables:", e)

