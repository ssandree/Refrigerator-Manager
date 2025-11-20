from sqlalchemy.orm import Session
from datetime import datetime
from app.meals.meal_models import Meal
from app.recipes.recipe_models import Recipe
from app.food.food_models import Food

def today_dashboard(db: Session, userId: str):
    today = datetime.utcnow().date()

    meals = db.query(Meal).filter(
        Meal.userId == userId,
        Meal.consumedAt >= datetime(today.year, today.month, today.day),
        Meal.consumedAt <= datetime(today.year, today.month, today.day, 23, 59, 59)
    ).all()

    recipes = {r.id: r for r in db.query(Recipe).all()}
    foods = {f.id: f for f in db.query(Food).filter(Food.userId == userId).all()}

    total = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

    for m in meals:
        # 레시피가 있는 경우
        if m.recipeId and m.recipeId in recipes:
            recipe = recipes[m.recipeId]
            total["calories"] += recipe.calories or 0
            total["protein"] += int(recipe.protein or 0)
            total["carbs"] += int(recipe.carbohydrates or 0)
            total["fat"] += int(recipe.fat or 0)
        
        # 직접 음식을 사용한 경우
        if m.foodIds:
            for food_id in m.foodIds:
                if food_id in foods:
                    food = foods[food_id]
                    # 음식의 영양 정보가 있는 경우 (calories_per_gram 기준으로 계산)
                    if food.calories_per_gram and food.weight:
                        try:
                            weight_grams = float(food.weight.replace('g', '').replace('kg', '').strip())
                            if 'kg' in food.weight.lower():
                                weight_grams *= 1000
                            calories = food.calories_per_gram * weight_grams
                            total["calories"] += int(calories)
                        except:
                            pass
                    if food.protein:
                        total["protein"] += int(food.protein)
                    if food.carbohydrates:
                        total["carbs"] += int(food.carbohydrates)
                    if food.fat:
                        total["fat"] += int(food.fat)

    return {
        "todayNutrition": total,
        "mealCount": len(meals)
    }

