from flask import Blueprint, jsonify, request
from db.models import db, Video

videos_routes = Blueprint('videos_routes', __name__)

# Get all videos
@videos_routes.route('/videos', methods=['GET'])
def get_videos():
    videos = Video.query.all()
    return jsonify([{
        "id": video.id,
        "track_id": video.track_id
    } for video in videos])

# Get a specific video by ID
@videos_routes.route('/videos/<int:video_id>', methods=['GET'])
def get_video(video_id):
    video = Video.query.get(video_id)
    if not video:
        return jsonify({"error": "Video not found"}), 404
    return jsonify({
        "id": video.id,
        "track_id": video.track_id
    })

# Create a new video
@videos_routes.route('/videos', methods=['POST'])
def create_video():
    if 'video_data' not in request.files:
        return jsonify({"error": "Video file is required"}), 400

    video_file = request.files['video_data']
    video_data = video_file.read()

    data = request.form
    new_video = Video(
        video_data=video_data,
        track_id=data.get('track_id')
    )
    db.session.add(new_video)
    db.session.commit()
    return jsonify({"message": "Video created successfully", "id": new_video.id}), 201

# Update an existing video
@videos_routes.route('/videos/<int:video_id>', methods=['PUT'])
def update_video(video_id):
    video = Video.query.get(video_id)
    if not video:
        return jsonify({"error": "Video not found"}), 404

    data = request.form

    if 'video_data' in request.files:
        video_file = request.files['video_data']
        video.video_data = video_file.read()

    video.track_id = data.get('track_id', video.track_id)
    db.session.commit()
    return jsonify({"message": "Video updated successfully"})

# Delete a video
@videos_routes.route('/videos/<int:video_id>', methods=['DELETE'])
def delete_video(video_id):
    video = Video.query.get(video_id)
    if not video:
        return jsonify({"error": "Video not found"}), 404

    db.session.delete(video)
    db.session.commit()
    return jsonify({"message": "Video deleted successfully"})
