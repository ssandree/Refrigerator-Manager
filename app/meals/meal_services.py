from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from app.meals.meal_models import Meal
from app.recipes.recipe_models import Recipe
from app.food.food_models import Food
from fastapi import HTTPException

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


def validate_recipe_exists(db: Session, recipe_id: str):
    """레시피 존재 여부 확인"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="RECIPE_NOT_FOUND")
    return recipe


def validate_foods_exist(db: Session, food_ids: list[str], userId: str):
    """음식 존재 여부 및 사용자 소유 여부 확인"""
    if not food_ids:
        return
    
    foods = db.query(Food).filter(
        Food.id.in_(food_ids),
        Food.userId == userId
    ).all()
    
    found_ids = {food.id for food in foods}
    missing_ids = set(food_ids) - found_ids
    
    if missing_ids:
        raise HTTPException(
            status_code=404, 
            detail=f"FOOD_NOT_FOUND: {', '.join(missing_ids)}"
        )
    
    return foods


def create_meal(db: Session, userId: str, data):
    # 유효성 검사
    if data.recipeId:
        validate_recipe_exists(db, data.recipeId)
    
    if data.foodIds:
        validate_foods_exist(db, data.foodIds, userId)
    
    # mealType을 문자열로 변환 (Enum인 경우)
    meal_type_value = data.mealType.value if hasattr(data.mealType, 'value') else data.mealType
    
    meal = Meal(
        userId=userId,
        recipeId=data.recipeId,
        foodIds=data.foodIds,
        quantity=data.quantity,
        consumedAt=data.consumedAt,
        notes=data.notes,
        mealType=meal_type_value
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
        # mealType을 문자열로 변환 (Enum인 경우)
        meal_type_value = data.mealType.value if hasattr(data.mealType, 'value') else data.mealType
        meal.mealType = meal_type_value

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

