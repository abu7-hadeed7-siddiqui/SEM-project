"""RecommendationRepository and RatingRepository."""
import json
from typing import Optional, List
from app.utils.database import get_connection
from app.domain.models.recommendation import Recommendation, RecommendationItem, Rating
from app.utils.helpers import parse_json_field


class RecommendationRepository:

    def create(self, user_id: int, algorithm_version: str, is_personalized: bool) -> int:
        """Insert a new recommendation header, return id."""
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    '''INSERT INTO recommendations (user_id, algorithm_version, is_personalized)
                       VALUES (%s, %s, %s)''',
                    (user_id, algorithm_version, int(is_personalized))
                )
                rec_id = cur.lastrowid
            conn.commit()
        return rec_id

    def create_item(self, recommendation_id: int, resource_id: int,
                    rank: int, score: float, match_reason: str) -> int:
        """Insert a recommendation item, return id."""
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    '''INSERT INTO recommendation_items
                       (recommendation_id, resource_id, `rank`, score, match_reason)
                       VALUES (%s, %s, %s, %s, %s)''',
                    (recommendation_id, resource_id, rank, score, match_reason)
                )
                item_id = cur.lastrowid
            conn.commit()
        return item_id

    def find_latest_with_items(self, user_id: int) -> Optional[dict]:
        """Return the most recent recommendation with items + resource data."""
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    '''SELECT * FROM recommendations
                       WHERE user_id = %s ORDER BY generated_at DESC LIMIT 1''',
                    (user_id,)
                )
                rec_row = cur.fetchone()
                if not rec_row:
                    return None

                rec_id = rec_row['id']
                cur.execute(
                    '''SELECT ri.*, res.title, res.description, res.category,
                              res.tags, res.difficulty, res.prerequisites,
                              res.url, res.average_rating, res.rating_count,
                              rat.id AS rating_id, rat.rating AS user_rating
                       FROM recommendation_items ri
                       JOIN resources res ON res.id = ri.resource_id
                       LEFT JOIN ratings rat ON rat.recommendation_item_id = ri.id
                       WHERE ri.recommendation_id = %s
                       ORDER BY ri.`rank`''',
                    (rec_id,)
                )
                items = cur.fetchall()
        return {'recommendation': rec_row, 'items': items}

    def find_history(self, user_id: int, limit: int = 50) -> List[dict]:
        """Return history of all recommendation items for a user."""
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    '''SELECT rec.id AS rec_id, rec.algorithm_version, rec.is_personalized,
                              rec.generated_at,
                              ri.id AS item_id, ri.`rank`, ri.score, ri.match_reason,
                              res.id AS resource_id, res.title, res.category,
                              res.difficulty, res.tags, res.average_rating,
                              rat.rating AS user_rating, rat.id AS rating_id
                       FROM recommendations rec
                       JOIN recommendation_items ri ON ri.recommendation_id = rec.id
                       JOIN resources res ON res.id = ri.resource_id
                       LEFT JOIN ratings rat ON rat.recommendation_item_id = ri.id
                       WHERE rec.user_id = %s
                       ORDER BY rec.generated_at DESC, ri.`rank`
                       LIMIT %s''',
                    (user_id, limit)
                )
                return cur.fetchall()

    def count(self) -> int:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT COUNT(*) AS cnt FROM recommendations')
                return cur.fetchone()['cnt']


class RatingRepository:

    def find_by_item(self, recommendation_item_id: int) -> Optional[dict]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'SELECT * FROM ratings WHERE recommendation_item_id = %s',
                    (recommendation_item_id,)
                )
                return cur.fetchone()

    def create_or_update(self, user_id: int, resource_id: int,
                         recommendation_item_id: int, rating: int) -> dict:
        existing = self.find_by_item(recommendation_item_id)
        with get_connection() as conn:
            with conn.cursor() as cur:
                if existing:
                    cur.execute(
                        'UPDATE ratings SET rating=%s WHERE id=%s',
                        (rating, existing['id'])
                    )
                    rating_id = existing['id']
                else:
                    cur.execute(
                        '''INSERT INTO ratings
                           (user_id, resource_id, recommendation_item_id, rating)
                           VALUES (%s, %s, %s, %s)''',
                        (user_id, resource_id, recommendation_item_id, rating)
                    )
                    rating_id = cur.lastrowid
            conn.commit()

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT * FROM ratings WHERE id = %s', (rating_id,))
                return cur.fetchone()

    def count(self) -> int:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT COUNT(*) AS cnt FROM ratings')
                return cur.fetchone()['cnt']

    def average(self) -> float:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT AVG(rating) AS avg FROM ratings')
                row = cur.fetchone()
                return float(row['avg'] or 0)

    def popular_categories(self) -> List[dict]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    '''SELECT res.category, COUNT(rat.id) AS rating_cnt, AVG(rat.rating) AS avg_rating
                       FROM ratings rat
                       JOIN resources res ON res.id = rat.resource_id
                       GROUP BY res.category
                       ORDER BY rating_cnt DESC
                       LIMIT 8'''
                )
                return cur.fetchall()
