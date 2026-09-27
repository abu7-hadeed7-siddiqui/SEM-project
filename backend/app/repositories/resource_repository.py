"""ResourceRepository."""
import json
from typing import Optional, List
from app.utils.database import get_connection
from app.domain.models.resource import Resource
from app.utils.helpers import parse_json_field


def _row_to_resource(row: dict) -> Optional[Resource]:
    if not row:
        return None
    return Resource(
        id=row['id'],
        title=row['title'],
        description=row['description'],
        category=row['category'],
        tags=parse_json_field(row.get('tags')),
        difficulty=row['difficulty'],
        prerequisites=parse_json_field(row.get('prerequisites')),
        url=row.get('url'),
        average_rating=float(row.get('average_rating', 0)),
        rating_count=int(row.get('rating_count', 0)),
        is_active=bool(row.get('is_active', 1)),
        created_at=row.get('created_at'),
        updated_at=row.get('updated_at'),
    )


class ResourceRepository:

    def find_all_active(self) -> List[Resource]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'SELECT * FROM resources WHERE is_active = 1 ORDER BY average_rating DESC'
                )
                return [_row_to_resource(r) for r in cur.fetchall()]

    def find_all(self, search: str = None, category: str = None,
                 difficulty: str = None, page: int = 1, per_page: int = 20) -> dict:
        with get_connection() as conn:
            with conn.cursor() as cur:
                where = ['1=1']
                params = []
                if search:
                    where.append('(title LIKE %s OR description LIKE %s OR category LIKE %s)')
                    like = f'%{search}%'
                    params.extend([like, like, like])
                if category:
                    where.append('category = %s')
                    params.append(category)
                if difficulty:
                    where.append('difficulty = %s')
                    params.append(difficulty)

                where_clause = ' AND '.join(where)
                cur.execute(f'SELECT COUNT(*) AS cnt FROM resources WHERE {where_clause}', params)
                total = cur.fetchone()['cnt']

                offset = (page - 1) * per_page
                params.extend([per_page, offset])
                cur.execute(
                    f'SELECT * FROM resources WHERE {where_clause} ORDER BY created_at DESC LIMIT %s OFFSET %s',
                    params
                )
                items = [_row_to_resource(r) for r in cur.fetchall()]
                return {'items': items, 'total': total, 'page': page, 'per_page': per_page}

    def find_by_id(self, resource_id: int) -> Optional[Resource]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT * FROM resources WHERE id = %s', (resource_id,))
                return _row_to_resource(cur.fetchone())

    def create(self, data: dict) -> Resource:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    '''INSERT INTO resources
                       (title, description, category, tags, difficulty, prerequisites, url)
                       VALUES (%s, %s, %s, %s, %s, %s, %s)''',
                    (
                        data['title'], data['description'], data['category'],
                        json.dumps(data.get('tags', [])),
                        data['difficulty'],
                        json.dumps(data.get('prerequisites', [])),
                        data.get('url')
                    )
                )
                resource_id = cur.lastrowid
            conn.commit()
        return self.find_by_id(resource_id)

    def update(self, resource_id: int, data: dict) -> Optional[Resource]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    '''UPDATE resources
                       SET title=%s, description=%s, category=%s, tags=%s,
                           difficulty=%s, prerequisites=%s, url=%s, is_active=%s
                       WHERE id=%s''',
                    (
                        data['title'], data['description'], data['category'],
                        json.dumps(data.get('tags', [])),
                        data['difficulty'],
                        json.dumps(data.get('prerequisites', [])),
                        data.get('url'),
                        data.get('is_active', 1),
                        resource_id
                    )
                )
            conn.commit()
        return self.find_by_id(resource_id)

    def delete(self, resource_id: int) -> bool:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('DELETE FROM resources WHERE id = %s', (resource_id,))
                affected = cur.rowcount
            conn.commit()
        return affected > 0

    def update_rating_stats(self, resource_id: int) -> None:
        """Recalculate and persist average_rating and rating_count for a resource."""
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    '''SELECT AVG(r.rating) AS avg_rating, COUNT(r.id) AS cnt
                       FROM ratings r WHERE r.resource_id = %s''',
                    (resource_id,)
                )
                row = cur.fetchone()
                avg = float(row['avg_rating'] or 0)
                cnt = int(row['cnt'] or 0)
                cur.execute(
                    'UPDATE resources SET average_rating=%s, rating_count=%s WHERE id=%s',
                    (round(avg, 2), cnt, resource_id)
                )
            conn.commit()

    def get_categories(self) -> List[str]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT DISTINCT category FROM resources ORDER BY category')
                return [r['category'] for r in cur.fetchall()]

    def count(self) -> int:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT COUNT(*) AS cnt FROM resources')
                return cur.fetchone()['cnt']
