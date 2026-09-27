"""AuthService — handles registration, login, logout."""
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from app.repositories.user_repository import UserRepository
from app.repositories.profile_repository import ProfileRepository
from app.utils.helpers import validate_email, validate_password

bcrypt = Bcrypt()
_user_repo = UserRepository()
_profile_repo = ProfileRepository()


class AuthService:

    def register(self, name: str, email: str, password: str) -> dict:
        # Validate inputs
        name = name.strip()
        email = email.strip().lower()

        if not name or len(name) < 2:
            return {'success': False, 'error': 'Name must be at least 2 characters.'}

        if not validate_email(email):
            return {'success': False, 'error': 'Invalid email address.'}

        valid_pw, pw_msg = validate_password(password)
        if not valid_pw:
            return {'success': False, 'error': pw_msg}

        # Duplicate check
        existing = _user_repo.find_by_email(email)
        if existing:
            return {'success': False, 'error': 'An account with this email already exists.'}

        # Hash password
        hashed = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create user + profile
        user = _user_repo.create(name, email, hashed)
        _profile_repo.create(user.id, [], [], 'Beginner')

        # Issue JWT
        token = create_access_token(identity=str(user.id),
                                    additional_claims={'role': user.role})
        return {
            'success': True,
            'token': token,
            'user': user.to_dict(),
        }

    def login(self, email: str, password: str) -> dict:
        email = email.strip().lower()
        user = _user_repo.find_by_email(email)

        if not user or not user.is_active:
            return {'success': False, 'error': 'Invalid email or password.'}

        # Check lockout
        if user.is_locked():
            return {'success': False, 'error': 'Account temporarily locked. Try again later.'}

        # Verify password
        if not bcrypt.check_password_hash(user.password, password):
            _user_repo.increment_login_attempts(user.id)
            return {'success': False, 'error': 'Invalid email or password.'}

        # Reset attempts on success
        _user_repo.reset_login_attempts(user.id)

        token = create_access_token(identity=str(user.id),
                                    additional_claims={'role': user.role})
        return {
            'success': True,
            'token': token,
            'user': user.to_dict(),
        }
