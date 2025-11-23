from sqlalchemy.orm import Session
from app.food.food_models import Food
from datetime import datetime, date, timedelta

def create_food(db: Session, userId: str, data):
    new_food = Food(
        userId=userId,
        imageUrl=data.imageUrl,
        category=data.category,
        name=data.name,
        quantity=data.quantity,
        weight=data.weight,
        purchaseDate=data.purchaseDate,
        expiryDate=data.expiryDate,
        storageLocation=data.storageLocation,
        alertBeforeDays=data.alertBeforeDays,
        calories_per_gram=data.calories_per_gram,
        carbohydrates=data.carbohydrates,
        protein=data.protein,
        fat=data.fat,
        sodium=data.sodium,
        vitamin_c=data.vitamin_c,
        vitamin_d=data.vitamin_d,
        zinc=data.zinc,
    )
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return new_food

def get_all(db: Session, userId: str):
    return db.query(Food).filter(Food.userId == userId).all()

def get_by_id(db: Session, food_id: str, userId: str):
    return db.query(Food).filter(
        Food.id == food_id,
        Food.userId == userId
    ).first()

def update_food(db: Session, food: Food, data):
    if data.imageUrl is not None:
        food.imageUrl = data.imageUrl
    if data.category is not None:
        food.category = data.category
    if data.name is not None:
        food.name = data.name
    if data.quantity is not None:
        food.quantity = data.quantity
    if data.weight is not None:
        food.weight = data.weight
    if data.purchaseDate is not None:
        food.purchaseDate = data.purchaseDate
    if data.expiryDate is not None:
        food.expiryDate = data.expiryDate
    if data.storageLocation is not None:
        food.storageLocation = data.storageLocation
    if data.alertBeforeDays is not None:
        food.alertBeforeDays = data.alertBeforeDays
    if data.calories_per_gram is not None:
        food.calories_per_gram = data.calories_per_gram
    if data.carbohydrates is not None:
        food.carbohydrates = data.carbohydrates
    if data.protein is not None:
        food.protein = data.protein
    if data.fat is not None:
        food.fat = data.fat
    if data.sodium is not None:
        food.sodium = data.sodium
    if data.vitamin_c is not None:
        food.vitamin_c = data.vitamin_c
    if data.vitamin_d is not None:
        food.vitamin_d = data.vitamin_d
    if data.zinc is not None:
        food.zinc = data.zinc
    
    db.commit()
    db.refresh(food)
    return food

def delete_food(db: Session, food: Food):
    db.delete(food)
    db.commit()
    return True


def get_by_category(db: Session, userId: str, category: str):
    """카테고리로 음식 필터링"""
    return db.query(Food).filter(
        Food.userId == userId,
        Food.category == category
    ).all()


def get_by_storage_location(db: Session, userId: str, location: str):
    """보관 위치로 음식 필터링"""
    return db.query(Food).filter(
        Food.userId == userId,
        Food.storageLocation == location
    ).all()


def get_expiring(db: Session, userId: str, days: int):
    """만료 예정 음식 조회 (지정된 일수 이내에 만료되는 음식)"""
    today = date.today()
    expiry_threshold = today + timedelta(days=days)
    
    return db.query(Food).filter(
        Food.userId == userId,
        Food.expiryDate.isnot(None),
        Food.expiryDate >= today,
        Food.expiryDate <= expiry_threshold
    ).all()


def get_expired(db: Session, userId: str):
    """만료된 음식 조회"""
    today = date.today()
    
    return db.query(Food).filter(
        Food.userId == userId,
        Food.expiryDate.isnot(None),
        Food.expiryDate < today
    ).all()


def bulk_delete_foods(db: Session, userId: str, food_ids: list[str]):
    """여러 음식 일괄 삭제"""
    foods = db.query(Food).filter(
        Food.userId == userId,
        Food.id.in_(food_ids)
    ).all()
    
    deleted_count = 0
    for food in foods:
        db.delete(food)
        deleted_count += 1
    
    db.commit()
    return deleted_count

