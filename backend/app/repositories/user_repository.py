"""UserRepository — all SQL operations for the users table."""
from datetime import datetime, timedelta
from typing import Optional
from app.utils.database import get_connection
from app.domain.models.user import User
from app.config.config import get_config

_config = get_config()


def _row_to_user(row: dict) -> Optional[User]:
    if not row:
        return None
    return User(
        id=row['id'],
        name=row['name'],
        email=row['email'],
        password=row['password'],
        role=row['role'],
        is_active=bool(row['is_active']),
        login_attempts=row['login_attempts'],
        locked_until=row.get('locked_until'),
        created_at=row.get('created_at'),
        updated_at=row.get('updated_at'),
    )


class UserRepository:

    def find_by_id(self, user_id: int) -> Optional[User]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
                return _row_to_user(cur.fetchone())

    def find_by_email(self, email: str) -> Optional[User]:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT * FROM users WHERE email = %s', (email,))
                return _row_to_user(cur.fetchone())

    def create(self, name: str, email: str, hashed_password: str, role: str = 'learner') -> User:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)',
                    (name, email, hashed_password, role)
                )
                user_id = cur.lastrowid
            conn.commit()
        return self.find_by_id(user_id)

    def increment_login_attempts(self, user_id: int) -> int:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE users SET login_attempts = login_attempts + 1 WHERE id = %s',
                    (user_id,)
                )
                cur.execute('SELECT login_attempts FROM users WHERE id = %s', (user_id,))
                row = cur.fetchone()
                attempts = row['login_attempts']
                if attempts >= _config.MAX_LOGIN_ATTEMPTS:
                    locked_until = datetime.utcnow() + timedelta(minutes=_config.LOCKOUT_MINUTES)
                    cur.execute(
                        'UPDATE users SET locked_until = %s WHERE id = %s',
                        (locked_until, user_id)
                    )
            conn.commit()
        return attempts

    def reset_login_attempts(self, user_id: int) -> None:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = %s',
                    (user_id,)
                )
            conn.commit()

    def get_all(self, limit: int = 1000) -> list:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT * FROM users ORDER BY created_at DESC LIMIT %s', (limit,))
                return [_row_to_user(r) for r in cur.fetchall()]

    def count(self) -> int:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('SELECT COUNT(*) AS cnt FROM users')
                return cur.fetchone()['cnt']
