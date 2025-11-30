### auth_service.py
from sqlalchemy.orm import Session
from app.auth.auth_models import User
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token
from jose import jwt
from app.core.config import settings

def register_user(db: Session, data):
    exists = db.query(User).filter(User.email == data.email).first()
    if exists:
        raise Exception("EMAIL_ALREADY_EXISTS")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
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


def get_current_user_info(db: Session, user_id: str):
    """현재 로그인한 사용자 정보를 조회"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("USER_NOT_FOUND")
    return user


def update_user_info(db: Session, user_id: str, data):
    """사용자 정보 수정"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("USER_NOT_FOUND")
    
    # 제공된 필드만 업데이트
    if data.name is not None:
        user.name = data.name
    if data.age is not None:
        user.age = data.age
    if data.sex is not None:
        user.sex = data.sex
    if data.weight is not None:
        user.weight = data.weight
    if data.height is not None:
        user.height = data.height
    if data.activityLevel is not None:
        user.activityLevel = data.activityLevel
    if data.bmi is not None:
        user.bmi = data.bmi
    
    db.commit()
    db.refresh(user)
    return user


def refresh_token(db: Session, token: str):
    """토큰 갱신 (만료된 토큰도 허용)"""
    try:
        # 만료된 토큰도 검증하기 위해 options={"verify_exp": False} 사용
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": False}
        )
        
        user_id = payload.get("userId")
        if not user_id:
            raise Exception("INVALID_TOKEN")
        
        # 사용자 존재 확인
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise Exception("USER_NOT_FOUND")
        
        # 새 토큰 발급
        new_token = create_access_token({"userId": user.id})
        
        return user, new_token
    except jwt.JWTError:
        raise Exception("INVALID_TOKEN")


def delete_user(db: Session, user_id: str):
    """계정 삭제 (관련 데이터도 함께 삭제)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("USER_NOT_FOUND")
    
    # 관련 데이터 삭제
    from app.food.food_models import Food
    from app.meals.meal_models import Meal
    from app.favorites.favorites_models import FavoriteRecipe
    from app.health_goals.health_models import UserHealthGoal
    from app.notifications.notification_models import Notification
    
    # 사용자 관련 데이터 삭제
    db.query(Food).filter(Food.userId == user_id).delete()
    db.query(Meal).filter(Meal.userId == user_id).delete()
    db.query(FavoriteRecipe).filter(FavoriteRecipe.userId == user_id).delete()
    db.query(UserHealthGoal).filter(UserHealthGoal.userId == user_id).delete()
    db.query(Notification).filter(Notification.userId == user_id).delete()
    
    # 사용자 삭제
    db.delete(user)
    db.commit()
    
    return True

