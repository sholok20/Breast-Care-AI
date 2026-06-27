from app.database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password

db = SessionLocal()

email = "admin@test.com"
password = "123456"

admin = db.query(User).filter(User.email == email).first()

if admin:
    admin.password_hash = hash_password(password)
    admin.role = "admin"
    print("Admin password updated")
else:
    admin = User(
        email=email,
        password_hash=hash_password(password),
        role="admin"
    )
    db.add(admin)
    print("Admin created")

db.commit()
db.close()