"""Auth routes: /api/auth/*"""
from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
_auth_service = AuthService()


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    result = _auth_service.register(
        name=data.get('name', ''),
        email=data.get('email', ''),
        password=data.get('password', ''),
    )
    if result['success']:
        return jsonify(result), 201
    return jsonify(result), 400


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    result = _auth_service.login(
        email=data.get('email', ''),
        password=data.get('password', ''),
    )
    if result['success']:
        return jsonify(result), 200
    return jsonify(result), 401


@auth_bp.route('/logout', methods=['POST'])
def logout():
    # JWT is stateless; client should discard token.
    return jsonify({'success': True, 'message': 'Logged out successfully.'}), 200
