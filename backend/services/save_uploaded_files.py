import os
from flask import current_app

def save_uploaded_files(song_file, img_file, track_id):
    # retrieve the upload folder from the app configuration 
    # if it doesn't exist, create one called second argument
    upload_folder = current_app.config.get('TRACKS_FOLDER', 'tracks')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    # create a unique directory for the track with the name of the track_id
    unique_dir = os.path.join(upload_folder, str(track_id))
    if not os.path.exists(unique_dir):
        os.makedirs(unique_dir)
    
    #save song file and img file in the unique directory
    song_filename = os.path.join(unique_dir, song_file.filename)
    img_filename = os.path.join(unique_dir, img_file.filename)

    song_path = os.path.join(str(track_id), song_file.filename)
    img_path = os.path.join(str(track_id), img_file.filename)

    song_file.save(song_filename)
    img_file.save(img_filename)

    return {
        'song_path': song_path, 
        'img_path': img_path
        }