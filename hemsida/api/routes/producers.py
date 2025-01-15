from flask import Blueprint, jsonify, request
from hemsida.database_models.models import  Producer, db

producers_routes = Blueprint('producers_routes', __name__)


# Get all producers
@producers_routes.route('/producers', methods=['GET'])
def get_producers():
    producers = Producer.query.all()
    return jsonify([{
        "id": producer.id,
        "producer": producer.producer,
        "lyriks_writer": producer.lyriks_writer,
        "track_id": producer.track_id
    } for producer in producers])

# Get a specific producer by ID
@producers_routes.route('/producers/<int:producer_id>', methods=['GET'])
def get_producer(producer_id):
    producer = Producer.query.get(producer_id)
    if not producer:
        return jsonify({"error": "Producer not found"}), 404
    return jsonify({
        "id": producer.id,
        "producer": producer.producer,
        "lyriks_writer": producer.lyriks_writer,
        "track_id": producer.track_id
    })

# Create a new producer
@producers_routes.route('/producers', methods=['POST'])
def create_producer():
    data = request.json
    if not data or 'producer' not in data:
        return jsonify({"error": "Producer name is required"}), 400

    new_producer = Producer(
        producer=data['producer'],
        lyriks_writer=data.get('lyriks_writer'),
        track_id=data.get('track_id')
    )
    db.session.add(new_producer)
    db.session.commit()
    return jsonify({"message": "Producer created successfully", "id": new_producer.id}), 201

# Update an existing producer
@producers_routes.route('/producers/<int:producer_id>', methods=['PUT'])
def update_producer(producer_id):
    producer = Producer.query.get(producer_id)
    if not producer:
        return jsonify({"error": "Producer not found"}), 404

    data = request.json
    producer.producer = data.get('producer', producer.producer)
    producer.lyriks_writer = data.get('lyriks_writer', producer.lyriks_writer)
    producer.track_id = data.get('track_id', producer.track_id)
    db.session.commit()
    return jsonify({"message": "Producer updated successfully"})

# Delete a producer
@producers_routes.route('/producers/<int:producer_id>', methods=['DELETE'])
def delete_producer(producer_id):
    producer = Producer.query.get(producer_id)
    if not producer:
        return jsonify({"error": "Producer not found"}), 404

    db.session.delete(producer)
    db.session.commit()
    return jsonify({"message": "Producer deleted successfully"})
