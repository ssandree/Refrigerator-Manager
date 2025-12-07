# app/dashboard/dashboard_services.py

from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.food.food_models import Food
from app.meals.meal_models import Meal
from app.recipes.recipe_models import Recipe
from app.recipes.recommend_service import recommend_recipes
from app.core.datetime_utils import get_kst_today, get_kst_now


# -----------------------------------------------------------
# Home Dashboard (최적화 버전)
# -----------------------------------------------------------
def home_dashboard(db: Session, userId: str):
    from app.core.datetime_utils import KST
    today = get_kst_today()
    start = datetime(today.year, today.month, today.day, tzinfo=KST)
    end = datetime(today.year, today.month, today.day, 23, 59, 59, tzinfo=KST)

    # -----------------------------
    # 1) 오늘의 Meals 조회 (쿼리 1회)
    # -----------------------------
    meals = db.query(Meal).filter(
        Meal.userId == userId,
        Meal.consumedAt >= start,
        Meal.consumedAt <= end
    ).order_by(Meal.consumedAt.desc()).all()

    # 오늘 필요한 recipeId만 가져오기
    recipe_ids = {m.recipeId for m in meals if m.recipeId}

    # -----------------------------
    # 2) 오늘 사용된 Recipe만 조회 (쿼리 1회)
    # -----------------------------
    recipes_map = {}
    if recipe_ids:
        recipes_map = {
            r.id: r for r in db.query(Recipe).filter(Recipe.id.in_(recipe_ids)).all()
        }

    # -----------------------------
    # 3) Expiring Foods (쿼리 1회)
    # -----------------------------
    threshold = today + timedelta(days=3)
    expiring_foods = db.query(Food).filter(
        Food.userId == userId,
        Food.expiryDate.isnot(None),
        Food.expiryDate >= today,
        Food.expiryDate <= threshold
    ).all()

    expiring_result = [
        {
            "id": f.id,
            "name": f.name,
            "expiryDate": f.expiryDate.isoformat(),
            "storageLocation": f.storageLocation
        }
        for f in expiring_foods
    ]

    # -----------------------------
    # 4) 식사 목록 payload
    # -----------------------------
    today_meals_payload = [
        {
            "id": m.id,
            "consumedAt": m.consumedAt.isoformat(),
            "mealType": m.mealType,
            "recipeId": m.recipeId,
            "notes": m.notes,
        }
        for m in meals
    ]

    # -----------------------------
    # 5) 오늘 영양소 계산
    # -----------------------------
    macros = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

    for meal in meals:
        recipe = recipes_map.get(meal.recipeId)
        if recipe:
            macros["calories"] += recipe.calories or 0
            macros["protein"] += int(recipe.protein or 0)
            macros["carbs"] += int(recipe.carbohydrates or 0)
            macros["fat"] += int(recipe.fat or 0)

    # -----------------------------
    # 6) 추천 레시피
    # -----------------------------
    recommended = recommend_recipes(db, userId)[:5]

    # -----------------------------
    # FINAL 반환 구조
    # -----------------------------
    return {
        "expiringIngredients": expiring_result,
        "recipeRecommendations": recommended,
        "todayMeals": today_meals_payload,
        "todayNutrition": macros,
    }
