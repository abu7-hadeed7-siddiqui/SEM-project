"""ProfileService."""
from app.repositories.profile_repository import ProfileRepository
from app.repositories.user_repository import UserRepository

_profile_repo = ProfileRepository()
_user_repo = UserRepository()


class ProfileService:

    def get_profile(self, user_id: int) -> dict:
        user = _user_repo.find_by_id(user_id)
        profile = _profile_repo.find_by_user_id(user_id)
        if not user:
            return {'success': False, 'error': 'User not found.'}
        return {
            'success': True,
            'user': user.to_dict(),
            'profile': profile.to_dict() if profile else None,
        }

    def save_profile(self, user_id: int, skills: list, goals: list, difficulty: str) -> dict:
        if not isinstance(skills, list):
            skills = []
        if not isinstance(goals, list):
            goals = []

        if not skills and not goals:
            return {'success': False, 'error': 'At least one skill or goal is required.'}

        valid_difficulties = ('Beginner', 'Intermediate', 'Advanced')
        if difficulty not in valid_difficulties:
            difficulty = 'Beginner'

        profile = _profile_repo.upsert(user_id, skills, goals, difficulty)
        return {'success': True, 'profile': profile.to_dict()}
