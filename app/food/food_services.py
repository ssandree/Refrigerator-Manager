from sqlalchemy.orm import Session
from app.food.food_models import Food
from datetime import date

def create_food(db: Session, userId: str, data):
    new_food = Food(
        userId=userId,
        imageUrl=data.imageUrl,
        category=data.category,
        name=data.name,
        quantity=data.quantity,
        weight=data.weight,
        purchaseDate=data.purchaseDate if data.purchaseDate is not None else date.today(),
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


def get_all_with_filters(
    db: Session, 
    userId: str,
    category: str | None = None,
    location: str | None = None,
    expired: bool | None = None,
    expiring: bool | None = None,
    sort: str | None = None
):
    """통합 필터링 함수"""
    query = db.query(Food).filter(Food.userId == userId)
    
    # 카테고리 필터
    if category:
        query = query.filter(Food.category == category)
    
    # 보관 장소 필터
    if location:
        query = query.filter(Food.storageLocation == location)
    
    # 만료 여부 필터
    today = date.today()
    if expired is not None:
        if expired:
            # 만료된 음식 (expiryDate가 오늘보다 이전)
            query = query.filter(
                Food.expiryDate.isnot(None),
                Food.expiryDate < today
            )
        else:
            # 만료되지 않은 음식 (expiryDate가 없거나 오늘 이후)
            query = query.filter(
                (Food.expiryDate.is_(None)) | (Food.expiryDate >= today)
            )
    
    # 정렬
    if sort:
        # "expiryDate ASC" 또는 "expiryDate DESC" 형식
        sort_parts = sort.strip().split()
        if len(sort_parts) == 2:
            column_name = sort_parts[0]
            order = sort_parts[1].upper()
            
            if column_name == "expiryDate":
                if order == "ASC":
                    query = query.order_by(Food.expiryDate.asc().nulls_last())
                elif order == "DESC":
                    query = query.order_by(Food.expiryDate.desc().nulls_last())
            elif column_name == "registeredAt":
                if order == "ASC":
                    query = query.order_by(Food.registeredAt.asc())
                elif order == "DESC":
                    query = query.order_by(Food.registeredAt.desc())
    
    foods = query.all()
    
    # 임박 여부 필터 (Python에서 처리 - 각 음식의 alertBeforeDays 값이 다르므로)
    if expiring is not None and expiring:
        filtered_foods = []
        for food in foods:
            if food.expiryDate and food.alertBeforeDays:
                days_until_expiry = (food.expiryDate - today).days
                if 0 <= days_until_expiry <= food.alertBeforeDays:
                    filtered_foods.append(food)
        foods = filtered_foods
    
    return foods

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

