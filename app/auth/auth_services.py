from sqlalchemy.orm import Session
from app.auth.auth_models import User
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token

def register_user(db: Session, data):
    exists = db.query(User).filter(User.email == data.email).first()
    if exists:
        raise Exception("EMAIL_ALREADY_EXISTS")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        age=data.age,
        sex=data.sex,
        bmi=data.bmi,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"userId": user.id})

    return user, token


def login_user(db: Session, data):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise Exception("INVALID_CREDENTIALS")

    token = create_access_token({"userId": user.id})
    return user, token

