"""Database connection management using PyMySQL."""
import pymysql
import pymysql.cursors
from app.config.config import get_config

_config = get_config()


def get_connection():
    """Return a new PyMySQL connection with DictCursor."""
    return pymysql.connect(
        host=_config.DB_HOST,
        port=_config.DB_PORT,
        user=_config.DB_USER,
        password=_config.DB_PASSWORD,
        database=_config.DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False
    )
