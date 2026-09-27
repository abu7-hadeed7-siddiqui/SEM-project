"""Fix admin password hashes in the database."""
import sys
sys.path.insert(0, '.')
from flask_bcrypt import Bcrypt
from app.utils.database import get_connection

bcrypt = Bcrypt()

admin_hash = bcrypt.generate_password_hash('Admin@1234').decode('utf-8')
student_hash = bcrypt.generate_password_hash('Student@1234').decode('utf-8')
alice_hash = bcrypt.generate_password_hash('Alice@1234').decode('utf-8')
bob_hash = bcrypt.generate_password_hash('Bob@1234').decode('utf-8')

with get_connection() as conn:
    with conn.cursor() as cur:
        cur.execute("UPDATE users SET password=%s WHERE email='admin@learnova.local'", (admin_hash,))
        cur.execute("UPDATE users SET password=%s WHERE email='student@learnova.local'", (student_hash,))
        cur.execute("UPDATE users SET password=%s WHERE email='alice@learnova.local'", (alice_hash,))
        cur.execute("UPDATE users SET password=%s WHERE email='bob@learnova.local'", (bob_hash,))
    conn.commit()

print("Password hashes updated successfully.")
print(f"admin@learnova.local: Admin@1234")
print(f"student@learnova.local: Student@1234")
