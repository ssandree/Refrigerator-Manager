from sqlalchemy.orm import Session
from app.food.models import Food
from datetime import datetime

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
    
    db.commit()
    db.refresh(food)
    return food

def delete_food(db: Session, food: Food):
    db.delete(food)
    db.commit()
    return True

