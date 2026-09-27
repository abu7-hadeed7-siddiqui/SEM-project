"""Flask application factory."""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

from app.config.config import get_config
from app.presentation.routes.auth_routes import auth_bp
from app.presentation.routes.profile_routes import profile_bp
from app.presentation.routes.recommendation_routes import rec_bp
from app.presentation.routes.admin_routes import admin_bp

bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    config = get_config()
    app.config.from_object(config)

    # Extensions
    CORS(app, resources={r'/api/*': {'origins': '*'}}, supports_credentials=True)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(rec_bp)
    app.register_blueprint(admin_bp)

    # Health check
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok', 'service': 'LEARNOVA API'}), 200

    # JWT error handlers
    @jwt.unauthorized_loader
    def unauthorized(reason):
        return jsonify({'success': False, 'error': 'Authentication required.'}), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({'success': False, 'error': 'Invalid token.'}), 401

    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_data):
        return jsonify({'success': False, 'error': 'Token expired. Please log in again.'}), 401

    # Generic error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'success': False, 'error': 'Endpoint not found.'}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({'success': False, 'error': 'Method not allowed.'}), 405

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'success': False, 'error': 'An internal error occurred.'}), 500

    return app
