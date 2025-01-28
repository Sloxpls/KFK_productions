import bcrypt

password_str = "kfk"
password = password_str.encode('utf-8')
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))
print(f"Hashed Password: {hashed.decode('utf-8')}")


import os

jwt_secret = os.urandom(32).hex()
print(f"JWT Secret: {jwt_secret}")
