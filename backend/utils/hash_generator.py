import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(password.encode(), salt)
    return hashed_pw.decode()

if __name__ == "__main__":
    user_input = input("Enter a string to hash: ")
    hashed_string = hash_password(user_input)
    print(f"Hashed Output: {hashed_string}")
