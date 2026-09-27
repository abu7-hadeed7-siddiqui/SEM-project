"""ProfileRepository — all SQL for profiles table."""
import json
from typing import Optional
from datetime import datetime
from app.utils.database import get_connection
from app.domain.models.profile import Profile
from app.utils.helpers import parse_json_field


def _row_to_profile(row: dict) -> Optional[Profile]:
    if not row:
        return None
    return Profile(
        id=row['id'],
        user_id=row['user_id'],
        skills=parse_json_field(row.get('skills')),
        goals=parse_json_field(row.get('goals')),
        difficulty=row.get('difficulty', 'Beginner'),
        completed_at=row.get('completed_at'),
        created_at=row.get('created_at'),
        updated_at=row.get('updated_at'),
    )


class ProfileRepository:

    def find_by_user_id(self, user_id: int) -> Optional[Profile]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT * FROM profiles WHERE user_id = %s', (user_id,))
                return _row_to_profile(cur.fetchone())

    def create(self, user_id: int, skills: list, goals: list, difficulty: str) -> Profile:
        with get_connection() as conn:
            with conn.cursor() as cur:
                completed_at = datetime.utcnow() if (skills or goals) else None
                cur.execute(
                    '''INSERT INTO profiles (user_id, skills, goals, difficulty, completed_at)
                       VALUES (%s, %s, %s, %s, %s)''',
                    (user_id, json.dumps(skills), json.dumps(goals), difficulty, completed_at)
                )
                profile_id = cur.lastrowid
            conn.commit()
        return self.find_by_user_id(user_id)

    def update(self, user_id: int, skills: list, goals: list, difficulty: str) -> Profile:
        with get_connection() as conn:
            with conn.cursor() as cur:
                completed_at = datetime.utcnow() if (skills or goals) else None
                cur.execute(
                    '''UPDATE profiles
                       SET skills = %s, goals = %s, difficulty = %s, completed_at = %s
                       WHERE user_id = %s''',
                    (json.dumps(skills), json.dumps(goals), difficulty, completed_at, user_id)
                )
            conn.commit()
        return self.find_by_user_id(user_id)

    def upsert(self, user_id: int, skills: list, goals: list, difficulty: str) -> Profile:
        existing = self.find_by_user_id(user_id)
        if existing:
            return self.update(user_id, skills, goals, difficulty)
        return self.create(user_id, skills, goals, difficulty)
