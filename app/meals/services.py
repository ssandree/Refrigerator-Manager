from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.meals.models import Meal

def get_all_meals(db: Session, userId: str):
    return db.query(Meal).filter(Meal.userId == userId).all()


def get_meal_by_id(db: Session, meal_id: str, userId: str):
    return db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.userId == userId
    ).first()


def get_meals_by_date_range(db: Session, userId: str, start, end):
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.consumedAt >= start,
        Meal.consumedAt <= end
    ).all()


def get_meals_by_date(db: Session, userId: str, date):
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.consumedAt.between(f"{date} 00:00:00", f"{date} 23:59:59")
    ).all()


def get_meals_by_type(db: Session, userId: str, mealType: str):
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.mealType == mealType
    ).all()


def get_meals_by_recipe(db: Session, userId: str, recipeId: str):
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.recipeId == recipeId
    ).all()


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

