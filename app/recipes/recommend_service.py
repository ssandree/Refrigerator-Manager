from sqlalchemy.orm import Session
from datetime import datetime
from app.food.food_models import Food
from app.recipes.recipe_models import Recipe

EXPIRY_SCORE_MAP = {
    1: 2.4,
    2: 2.2,
    3: 2.0,
    4: 1.2,
    5: 1.1,
    6: 1.0,
    7: 0.8,
}

def calculate_expiry_score(food: Food):
    if not food.expiryDate:
        return 0

    today = datetime.utcnow().date()
    dday = (food.expiryDate - today).days

    if dday <= 0:
        return 0  # 이미 만료 or 오늘 만료 → 점수 없음

    if dday in EXPIRY_SCORE_MAP:
        return EXPIRY_SCORE_MAP[dday]

    return 0


def recommend_recipes(db: Session, userId: str):
    # 1) 유저 재료 가져오기
    user_foods = db.query(Food).filter(Food.userId == userId).all()
    food_dict = {food.name: food for food in user_foods}

    # 2) 모든 레시피 가져오기
    recipes = db.query(Recipe).all()

    result = []

    for recipe in recipes:
        matched_count = 0
        expiry_score_sum = 0

        # 필요한 재료
        required = recipe.requiredfoods or []
        total_required = len(required)

        matched_foods = []

        for name in required:
            if name in food_dict:
                matched_count += 1

                food = food_dict[name]
                score = calculate_expiry_score(food)
                expiry_score_sum += score

                matched_foods.append({
                    "food": name,
                    "expiryScore": score
                })

        # matchScore 계산
        match_score = (matched_count / total_required) if total_required > 0 else 0

        # 최종 점수
        final_score = expiry_score_sum + (match_score * 10)

        result.append({
            "id": recipe.id,
            "recipeName": recipe.recipeName,
            "foodsOwned": matched_count,
            "totalFoods": total_required,
            "score": final_score,
            "scoreDetails": {
                "score": final_score,
                "expiryScore": expiry_score_sum,
                "matchScore": match_score,
                "matchedCount": matched_count,
                "totalRequired": total_required,
                "matchedFoods": matched_foods
            },
            "imageUrl": recipe.imageUrl,
        })

    # 점수 높은 순으로 정렬
    result.sort(key=lambda x: x["score"], reverse=True)

    return result

