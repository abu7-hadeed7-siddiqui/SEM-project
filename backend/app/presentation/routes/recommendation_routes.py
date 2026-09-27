"""Recommendation routes: /api/recommendations"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.recommendation_service import RecommendationService

rec_bp = Blueprint('recommendations', __name__, url_prefix='/api/recommendations')
_rec_service = RecommendationService()


@rec_bp.route('', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Return latest recommendations. If none exist, generate fresh ones."""
    user_id = int(get_jwt_identity())
    refresh = request.args.get('refresh', 'false').lower() == 'true'

    if refresh:
        result = _rec_service.generate_for_user(user_id)
    else:
        result = _rec_service.get_latest(user_id)
        if not result['success']:
            # Auto-generate on first load
            result = _rec_service.generate_for_user(user_id)

    if result['success']:
        return jsonify(result), 200
    return jsonify(result), 400


@rec_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_recommendations():
    user_id = int(get_jwt_identity())
    result = _rec_service.generate_for_user(user_id)
    if result['success']:
        return jsonify(result), 201
    return jsonify(result), 400


@rec_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    result = _rec_service.get_history(user_id)
    return jsonify(result), 200


@rec_bp.route('/ratings', methods=['POST'])
@jwt_required()
def submit_rating():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    try:
        recommendation_item_id = int(data.get('recommendation_item_id', 0))
        resource_id = int(data.get('resource_id', 0))
        rating = int(data.get('rating', 0))
    except (ValueError, TypeError):
        return jsonify({'success': False, 'error': 'Invalid data format.'}), 400

    if not recommendation_item_id or not resource_id:
        return jsonify({'success': False, 'error': 'recommendation_item_id and resource_id are required.'}), 400

    result = _rec_service.submit_rating(user_id, recommendation_item_id, resource_id, rating)
    if result['success']:
        return jsonify(result), 200
    return jsonify(result), 400
