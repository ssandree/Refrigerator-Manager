from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, Tuple
from app.meals.meal_models import Meal
from app.recipes.recipe_models import Recipe
from app.food.food_models import Food
from fastapi import HTTPException

def get_meal_by_id(db: Session, meal_id: str, userId: str):
    return db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.userId == userId
    ).first()


def _parse_date(value: str) -> datetime:
    """주어진 문자열을 datetime으로 변환 (시각 정보 없으면 날짜만 사용)."""
    try:
        return datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        try:
            return datetime.strptime(value, "%Y-%m-%d")
        except ValueError:
            return datetime.strptime(value.split('T')[0], "%Y-%m-%d")


def _day_range(value: str) -> Tuple[datetime, datetime]:
    date_obj = _parse_date(value)
    start_datetime = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
    end_datetime = date_obj.replace(hour=23, minute=59, second=59, microsecond=999999)
    return start_datetime, end_datetime


def query_meals(
    db: Session,
    userId: str,
    date: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    meal_type: Optional[str] = None,
    recipe_id: Optional[str] = None,
):
    query = db.query(Meal).filter(Meal.userId == userId)

    if date:
        start_dt, end_dt = _day_range(date)
        query = query.filter(Meal.consumedAt >= start_dt, Meal.consumedAt <= end_dt)
    else:
        if start_date:
            start_dt = _parse_date(start_date).replace(hour=0, minute=0, second=0, microsecond=0)
            query = query.filter(Meal.consumedAt >= start_dt)
        if end_date:
            end_dt = _parse_date(end_date).replace(hour=23, minute=59, second=59, microsecond=999999)
            query = query.filter(Meal.consumedAt <= end_dt)

    if meal_type:
        query = query.filter(Meal.mealType == meal_type)

    if recipe_id:
        query = query.filter(Meal.recipeId == recipe_id)

    return query.order_by(Meal.consumedAt.desc()).all()


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
    recipe = None
    if data.recipeId:
        recipe = validate_recipe_exists(db, data.recipeId)
    
    if data.foodIds:
        validate_foods_exist(db, data.foodIds, userId)
    
    # mealType을 문자열로 변환 (Enum인 경우)
    meal_type_value = data.mealType.value if hasattr(data.mealType, 'value') else data.mealType
    
    # 영양소 정보: 사용자가 제공한 값이 있으면 우선 사용, 없으면 Recipe에서 가져오기
    calories = data.calories
    carbohydrates = data.carbohydrates
    protein = data.protein
    fat = data.fat
    sodium = data.sodium
    vitamin_c = data.vitamin_c
    vitamin_d = data.vitamin_d
    zinc = data.zinc
    
    # Recipe가 있고 사용자가 영양소 정보를 제공하지 않은 경우, Recipe에서 복사
    if recipe:
        if calories is None:
            calories = recipe.calories
        if carbohydrates is None:
            carbohydrates = recipe.carbohydrates
        if protein is None:
            protein = recipe.protein
        if fat is None:
            fat = recipe.fat
        if sodium is None:
            sodium = recipe.sodium
        if vitamin_c is None:
            vitamin_c = recipe.vitamin_c
        if vitamin_d is None:
            vitamin_d = recipe.vitamin_d
        if zinc is None:
            zinc = recipe.zinc
    
    meal = Meal(
        userId=userId,
        recipeId=data.recipeId,
        foodIds=data.foodIds,
        quantity=data.quantity,
        consumedAt=data.consumedAt,
        notes=data.notes,
        mealType=meal_type_value,
        calories=calories,
        carbohydrates=carbohydrates,
        protein=protein,
        fat=fat,
        sodium=sodium,
        vitamin_c=vitamin_c,
        vitamin_d=vitamin_d,
        zinc=zinc
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal


def update_meal(db: Session, meal: Meal, data):
    if data.consumedAt is not None:
        meal.consumedAt = data.consumedAt
    if data.quantity is not None:
        meal.quantity = data.quantity
    if data.notes is not None:
        meal.notes = data.notes
    if data.mealType is not None:
        # mealType을 문자열로 변환 (Enum인 경우)
        meal_type_value = data.mealType.value if hasattr(data.mealType, 'value') else data.mealType
        meal.mealType = meal_type_value
    if data.calories is not None:
        meal.calories = data.calories
    if data.carbohydrates is not None:
        meal.carbohydrates = data.carbohydrates
    if data.protein is not None:
        meal.protein = data.protein
    if data.fat is not None:
        meal.fat = data.fat
    if data.sodium is not None:
        meal.sodium = data.sodium
    if data.vitamin_c is not None:
        meal.vitamin_c = data.vitamin_c
    if data.vitamin_d is not None:
        meal.vitamin_d = data.vitamin_d
    if data.zinc is not None:
        meal.zinc = data.zinc

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

    # 칼로리 합계 계산 (null 값은 0으로 처리)
    totalCalories = sum(meal.calories or 0 for meal in meals)

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

