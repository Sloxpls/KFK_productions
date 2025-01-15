import os

def list_files_in_directory(directory_path):

    entries = os.listdir(directory_path)
    files = [os.path.join(directory_path, entry) for entry in entries if os.path.isfile(os.path.join(directory_path, entry))]
    return files


# Example usage:
if __name__ == "__main__":
    directory = ("../../assets/img"
                 "")
    files = list_files_in_directory(directory)
    for file in files:
        print(file)
