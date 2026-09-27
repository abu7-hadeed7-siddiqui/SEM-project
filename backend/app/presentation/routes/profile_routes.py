"""Profile routes: /api/profile"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.profile_service import ProfileService

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')
_profile_service = ProfileService()


@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    result = _profile_service.get_profile(user_id)
    if result['success']:
        return jsonify(result), 200
    return jsonify(result), 404


@profile_bp.route('', methods=['PUT'])
@jwt_required()
def save_profile():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    result = _profile_service.save_profile(
        user_id=user_id,
        skills=data.get('skills', []),
        goals=data.get('goals', []),
        difficulty=data.get('difficulty', 'Beginner'),
    )
    if result['success']:
        return jsonify(result), 200
    return jsonify(result), 400
