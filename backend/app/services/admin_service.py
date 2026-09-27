"""AdminService — statistics and admin operations."""
from app.repositories.user_repository import UserRepository
from app.repositories.resource_repository import ResourceRepository
from app.repositories.recommendation_repository import RecommendationRepository, RatingRepository

_user_repo = UserRepository()
_resource_repo = ResourceRepository()
_rec_repo = RecommendationRepository()
_rating_repo = RatingRepository()


class AdminService:

    def get_stats(self) -> dict:
        return {
            'total_users': _user_repo.count(),
            'total_resources': _resource_repo.count(),
            'total_recommendations': _rec_repo.count(),
            'total_ratings': _rating_repo.count(),
            'average_rating': round(_rating_repo.average(), 2),
            'popular_categories': [
                {
                    'category': r['category'],
                    'rating_count': r['rating_cnt'],
                    'avg_rating': round(float(r['avg_rating'] or 0), 2)
                }
                for r in _rating_repo.popular_categories()
            ]
        }

    def list_resources(self, search: str = None, category: str = None,
                       difficulty: str = None, page: int = 1, per_page: int = 20) -> dict:
        result = _resource_repo.find_all(search, category, difficulty, page, per_page)
        return {
            'items': [r.to_dict() for r in result['items']],
            'total': result['total'],
            'page': result['page'],
            'per_page': result['per_page'],
        }

    def create_resource(self, data: dict) -> dict:
        errors = self._validate_resource(data)
        if errors:
            return {'success': False, 'error': errors[0]}
        resource = _resource_repo.create(data)
        return {'success': True, 'resource': resource.to_dict()}

    def update_resource(self, resource_id: int, data: dict) -> dict:
        existing = _resource_repo.find_by_id(resource_id)
        if not existing:
            return {'success': False, 'error': 'Resource not found.'}
        errors = self._validate_resource(data)
        if errors:
            return {'success': False, 'error': errors[0]}
        resource = _resource_repo.update(resource_id, data)
        return {'success': True, 'resource': resource.to_dict()}

    def delete_resource(self, resource_id: int) -> dict:
        existing = _resource_repo.find_by_id(resource_id)
        if not existing:
            return {'success': False, 'error': 'Resource not found.'}
        _resource_repo.delete(resource_id)
        return {'success': True}

    def _validate_resource(self, data: dict) -> list:
        errors = []
        if not data.get('title') or len(data['title'].strip()) < 3:
            errors.append('Title must be at least 3 characters.')
        if not data.get('description') or len(data['description'].strip()) < 10:
            errors.append('Description must be at least 10 characters.')
        if not data.get('category'):
            errors.append('Category is required.')
        if data.get('difficulty') not in ('Beginner', 'Intermediate', 'Advanced'):
            errors.append('Difficulty must be Beginner, Intermediate, or Advanced.')
        return errors
