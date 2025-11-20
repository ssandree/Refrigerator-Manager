from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from app.meals.meal_models import Meal

def get_all_meals(db: Session, userId: str):
    return db.query(Meal).filter(Meal.userId == userId).order_by(Meal.consumedAt.desc()).all()


def get_meal_by_id(db: Session, meal_id: str, userId: str):
    return db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.userId == userId
    ).first()


def get_meals_by_date_range(db: Session, userId: str, start_date_str: str, end_date_str: str):
    try:
        # 날짜 문자열을 datetime으로 변환
        start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
    except ValueError:
        # ISO 형식이 아닌 경우 다른 형식 시도
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
            # 하루의 끝 시간으로 설정
            end_date = end_date.replace(hour=23, minute=59, second=59)
        except ValueError:
            # 기본값으로 처리
            start_date = datetime.strptime(start_date_str.split('T')[0], "%Y-%m-%d")
            end_date = datetime.strptime(end_date_str.split('T')[0], "%Y-%m-%d")
            end_date = end_date.replace(hour=23, minute=59, second=59)
    
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.consumedAt >= start_date,
        Meal.consumedAt <= end_date
    ).order_by(Meal.consumedAt.desc()).all()


def get_meals_by_date(db: Session, userId: str, date_str: str):
    try:
        # 날짜 문자열 파싱
        if 'T' in date_str:
            date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        else:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        
        start_datetime = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
        end_datetime = date_obj.replace(hour=23, minute=59, second=59, microsecond=999999)
    except ValueError:
        # 기본 형식 시도
        date_obj = datetime.strptime(date_str.split('T')[0], "%Y-%m-%d")
        start_datetime = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
        end_datetime = date_obj.replace(hour=23, minute=59, second=59, microsecond=999999)
    
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.consumedAt >= start_datetime,
        Meal.consumedAt <= end_datetime
    ).order_by(Meal.consumedAt.desc()).all()


def get_meals_by_type(db: Session, userId: str, mealType: str):
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.mealType == mealType
    ).order_by(Meal.consumedAt.desc()).all()


def get_meals_by_recipe(db: Session, userId: str, recipeId: str):
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.recipeId == recipeId
    ).order_by(Meal.consumedAt.desc()).all()


def create_meal(db: Session, userId: str, data):
    meal = Meal(
        userId=userId,
        recipeId=data.recipeId,
        foodIds=data.foodIds,
        quantity=data.quantity,
        consumedAt=data.consumedAt,
        notes=data.notes,
        mealType=data.mealType
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal


def update_meal(db: Session, meal: Meal, data):
    if data.quantity is not None:
        meal.quantity = data.quantity
    if data.notes is not None:
        meal.notes = data.notes
    if data.mealType is not None:
        meal.mealType = data.mealType

    db.commit()
    db.refresh(meal)
    return meal


def delete_meal(db: Session, meal: Meal):
    db.delete(meal)
    db.commit()
    return True


def get_statistics(db: Session, userId: str):
    meals = db.query(Meal).filter(Meal.userId == userId).all()

    totalMeals = len(meals)

    # 칼로리 계산은 Recipe 모델 참조해야 함 (임시 기본값: 0)
    totalCalories = 0

    if totalMeals == 0:
        return {
            "totalCalories": 0,
            "totalMeals": 0,
            "averagePerMeal": 0
        }

    average = totalCalories / totalMeals if totalMeals > 0 else 0

    return {
        "totalCalories": totalCalories,
        "totalMeals": totalMeals,
        "averagePerMeal": average
    }

