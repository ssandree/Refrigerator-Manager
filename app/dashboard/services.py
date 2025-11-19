from sqlalchemy.orm import Session
from datetime import datetime
from app.meals.models import Meal
from app.recipes.models import Recipe

def today_dashboard(db: Session, userId: str):
    today = datetime.utcnow().date()

    meals = db.query(Meal).filter(
        Meal.userId == userId,
        Meal.consumedAt >= datetime(today.year, today.month, today.day),
        Meal.consumedAt <= datetime(today.year, today.month, today.day, 23, 59, 59)
    ).all()

    recipes = {r.id: r for r in db.query(Recipe).all()}

    total = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

    for m in meals:
        if m.recipeId in recipes and recipes[m.recipeId].nutritionInfo:
            nut = recipes[m.recipeId].nutritionInfo
            for k in total.keys():
                total[k] += nut.get(k, 0)

    return {
        "todayNutrition": total,
        "mealCount": len(meals)
    }

