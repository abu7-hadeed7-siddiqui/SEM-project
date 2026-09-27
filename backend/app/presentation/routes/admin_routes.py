"""Admin routes: /api/admin/*"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.services.admin_service import AdminService

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')
_admin_service = AdminService()


def require_admin():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'success': False, 'error': 'Admin access required.'}), 403
    return None


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    err = require_admin()
    if err:
        return err
    return jsonify({'success': True, 'stats': _admin_service.get_stats()}), 200


@admin_bp.route('/resources', methods=['GET'])
@jwt_required()
def list_resources():
    err = require_admin()
    if err:
        return err
    search = request.args.get('search')
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    data = _admin_service.list_resources(search, category, difficulty, page, per_page)
    return jsonify({'success': True, **data}), 200


@admin_bp.route('/resources', methods=['POST'])
@jwt_required()
def create_resource():
    err = require_admin()
    if err:
        return err
    data = request.get_json(silent=True) or {}
    result = _admin_service.create_resource(data)
    if result['success']:
        return jsonify(result), 201
    return jsonify(result), 400


@admin_bp.route('/resources/<int:resource_id>', methods=['PUT'])
@jwt_required()
def update_resource(resource_id: int):
    err = require_admin()
    if err:
        return err
    data = request.get_json(silent=True) or {}
    result = _admin_service.update_resource(resource_id, data)
    if result['success']:
        return jsonify(result), 200
    return jsonify(result), 400


@admin_bp.route('/resources/<int:resource_id>', methods=['DELETE'])
@jwt_required()
def delete_resource(resource_id: int):
    err = require_admin()
    if err:
        return err
    result = _admin_service.delete_resource(resource_id)
    if result['success']:
        return jsonify(result), 200
    return jsonify(result), 404


@admin_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    err = require_admin()
    if err:
        return err
    from app.repositories.resource_repository import ResourceRepository
    categories = ResourceRepository().get_categories()
    return jsonify({'success': True, 'categories': categories}), 200
