"""RecommendationService — orchestrates the recommendation pipeline."""
from app.repositories.profile_repository import ProfileRepository
from app.repositories.resource_repository import ResourceRepository
from app.repositories.recommendation_repository import RecommendationRepository, RatingRepository
from app.domain.recommendation_engine import RecommendationEngine
from app.domain.strategies.recommendation_strategies import TagOverlapStrategy, PopularityStrategy
from app.utils.helpers import parse_json_field

_profile_repo = ProfileRepository()
_resource_repo = ResourceRepository()
_rec_repo = RecommendationRepository()
_rating_repo = RatingRepository()


class RecommendationService:

    def generate_for_user(self, user_id: int) -> dict:
        """Run the recommendation pipeline and persist results."""
        profile = _profile_repo.find_by_user_id(user_id)
        if not profile:
            return {'success': False, 'error': 'Profile not found. Please complete your profile first.'}

        resources = _resource_repo.find_all_active()
        if not resources:
            return {'success': False, 'error': 'No resources available.'}

        engine = RecommendationEngine(strategy=TagOverlapStrategy())
        result = engine.generate(profile, resources, top_n=5)

        # Persist
        rec_id = _rec_repo.create(
            user_id,
            result['algorithm_version'],
            result['is_personalized']
        )

        items_out = []
        for rank, item in enumerate(result['items'], start=1):
            resource = item['resource']
            item_id = _rec_repo.create_item(
                rec_id, resource.id, rank, item['score'], item['match_reason']
            )
            items_out.append({
                'id': item_id,
                'recommendation_id': rec_id,
                'resource_id': resource.id,
                'rank': rank,
                'score': item['score'],
                'match_reason': item['match_reason'],
                'resource': resource.to_dict(),
                'rating': None,
                'rating_id': None,
            })

        return {
            'success': True,
            'recommendation': {
                'id': rec_id,
                'user_id': user_id,
                'algorithm_version': result['algorithm_version'],
                'is_personalized': result['is_personalized'],
                'items': items_out,
            }
        }

    def get_latest(self, user_id: int) -> dict:
        """Fetch the most recent recommendation without regenerating."""
        data = _rec_repo.find_latest_with_items(user_id)
        if not data:
            return {'success': False, 'error': 'No recommendations found.'}

        rec = data['recommendation']
        items = []
        for row in data['items']:
            resource = {
                'id': row['resource_id'],
                'title': row['title'],
                'description': row['description'],
                'category': row['category'],
                'tags': parse_json_field(row.get('tags')),
                'difficulty': row['difficulty'],
                'prerequisites': parse_json_field(row.get('prerequisites')),
                'url': row.get('url'),
                'average_rating': float(row.get('average_rating', 0)),
                'rating_count': int(row.get('rating_count', 0)),
            }
            items.append({
                'id': row['id'],
                'recommendation_id': row['recommendation_id'],
                'resource_id': row['resource_id'],
                'rank': row['rank'],
                'score': float(row['score']),
                'match_reason': row.get('match_reason', ''),
                'resource': resource,
                'rating': row.get('user_rating'),
                'rating_id': row.get('rating_id'),
            })

        return {
            'success': True,
            'recommendation': {
                'id': rec['id'],
                'user_id': rec['user_id'],
                'algorithm_version': rec['algorithm_version'],
                'is_personalized': bool(rec['is_personalized']),
                'generated_at': rec['generated_at'].isoformat() if rec['generated_at'] else None,
                'items': items,
            }
        }

    def get_history(self, user_id: int) -> dict:
        rows = _rec_repo.find_history(user_id)
        history = []
        for row in rows:
            history.append({
                'rec_id': row['rec_id'],
                'algorithm_version': row['algorithm_version'],
                'is_personalized': bool(row['is_personalized']),
                'generated_at': row['generated_at'].isoformat() if row['generated_at'] else None,
                'item_id': row['item_id'],
                'rank': row['rank'],
                'score': float(row['score']),
                'match_reason': row.get('match_reason', ''),
                'resource': {
                    'id': row['resource_id'],
                    'title': row['title'],
                    'category': row['category'],
                    'difficulty': row['difficulty'],
                    'tags': parse_json_field(row.get('tags')),
                    'average_rating': float(row.get('average_rating', 0)),
                },
                'user_rating': row.get('user_rating'),
                'rating_id': row.get('rating_id'),
            })
        return {'success': True, 'history': history}

    def submit_rating(self, user_id: int, recommendation_item_id: int,
                      resource_id: int, rating: int) -> dict:
        if rating < 1 or rating > 5:
            return {'success': False, 'error': 'Rating must be between 1 and 5.'}

        saved = _rating_repo.create_or_update(
            user_id, resource_id, recommendation_item_id, rating
        )
        _resource_repo.update_rating_stats(resource_id)

        return {
            'success': True,
            'rating': {
                'id': saved['id'],
                'rating': saved['rating'],
                'resource_id': saved['resource_id'],
                'recommendation_item_id': saved['recommendation_item_id'],
            }
        }
