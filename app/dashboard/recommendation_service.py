from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from app.auth.auth_models import User
from app.food.food_models import Food
from app.recipes.recipe_models import Recipe
from app.health_goals.health_models import UserHealthGoal
from app.health_goals.health_status_service import get_nutrition_targets

# 임박 재료 점수 매핑
EXPIRY_SCORE_MAP = {
    1: 2.4,
    2: 2.2,
    3: 2.0,
    4: 1.2,
    5: 1.1,
    6: 1.0,
    7: 0.8,
}

# 활동지수 상수
ACTIVITY_LEVELS = {
    1.2: "거의 활동 없음",
    1.375: "가벼운 활동",
    1.55: "보통 활동",
    1.725: "높은 활동",
    1.9: "매우 높은 활동"
}


def calculate_match_score(recipe: Recipe, user_foods: List[Food]) -> Tuple[float, List[str], List[str]]:
    """
    재료 매칭 점수 계산
    matchScore = (보유 재료 ∩ 레시피 필요 재료) / 전체 필요 재료 × 10
    
    Returns:
        (match_score, used_ingredients, missing_ingredients)
    """
    required_foods = recipe.requiredfoods or []
    if not required_foods:
        return 0.0, [], []
    
    user_food_names = {food.name for food in user_foods}
    required_set = set(required_foods)
    
    matched = required_set.intersection(user_food_names)
    match_ratio = len(matched) / len(required_set) if required_set else 0.0
    match_score = match_ratio * 10.0
    
    used_ingredients = list(matched)
    missing_ingredients = list(required_set - matched)
    
    return match_score, used_ingredients, missing_ingredients


def calculate_expiry_score(recipe: Recipe, user_foods: List[Food]) -> float:
    """
    임박 재료 사용 점수 계산
    레시피에 사용되는 임박 재료들의 점수 합계
    """
    required_foods = recipe.requiredfoods or []
    if not required_foods:
        return 0.0
    
    user_food_dict = {food.name: food for food in user_foods}
    expiry_score_sum = 0.0
    
    today = datetime.utcnow().date()
    
    for food_name in required_foods:
        if food_name in user_food_dict:
            food = user_food_dict[food_name]
            if food.expiryDate:
                dday = (food.expiryDate - today).days
                if 1 <= dday <= 7:
                    expiry_score_sum += EXPIRY_SCORE_MAP.get(dday, 0.0)
    
    return expiry_score_sum


def calculate_nutrition_score(recipe: Recipe, nutrition_targets: Dict[str, float]) -> float:
    """
    건강 목표 일치도 점수 계산
    레시피 영양소가 목표 영양소를 얼마나 충족하는지 계산
    
    Returns:
        nutrition_score (0.0 ~ 1.0 범위로 정규화)
    """
    if not nutrition_targets:
        return 0.0
    
    # 레시피 영양소 값 (None인 경우 0으로 처리)
    recipe_nutrition = {
        'protein': recipe.protein or 0.0,
        'carbohydrates': recipe.carbohydrates or 0.0,
        'fat': recipe.fat or 0.0,
        'vitamin_c': recipe.vitamin_c or 0.0,
        'vitamin_d': recipe.vitamin_d or 0.0,
        'zinc': recipe.zinc or 0.0,
    }
    
    # 각 영양소별 기여율 계산
    contribution_rates = []
    
    # 단백질 기여율
    if nutrition_targets.get('protein', 0) > 0:
        protein_contribution = min(recipe_nutrition['protein'] / nutrition_targets['protein'], 1.0)
        contribution_rates.append(protein_contribution)
    
    # 탄수화물 기여율
    if nutrition_targets.get('carbohydrates', 0) > 0:
        carb_contribution = min(recipe_nutrition['carbohydrates'] / nutrition_targets['carbohydrates'], 1.0)
        contribution_rates.append(carb_contribution)
    
    # 지방 기여율
    if nutrition_targets.get('fat', 0) > 0:
        fat_contribution = min(recipe_nutrition['fat'] / nutrition_targets['fat'], 1.0)
        contribution_rates.append(fat_contribution)
    
    # 비타민C 기여율 (목표가 있는 경우만)
    if nutrition_targets.get('vitamin_c', 0) > 0:
        vitc_contribution = min(recipe_nutrition['vitamin_c'] / nutrition_targets['vitamin_c'], 1.0)
        contribution_rates.append(vitc_contribution)
    
    # 비타민D 기여율 (목표가 있는 경우만)
    if nutrition_targets.get('vitamin_d', 0) > 0:
        vitd_contribution = min(recipe_nutrition['vitamin_d'] / nutrition_targets['vitamin_d'], 1.0)
        contribution_rates.append(vitd_contribution)
    
    # 아연 기여율 (목표가 있는 경우만)
    if nutrition_targets.get('zinc', 0) > 0:
        zinc_contribution = min(recipe_nutrition['zinc'] / nutrition_targets['zinc'], 1.0)
        contribution_rates.append(zinc_contribution)
    
    # 평균 기여율 계산
    if not contribution_rates:
        return 0.0
    
    nutrition_score = sum(contribution_rates) / len(contribution_rates)
    return nutrition_score


def calculate_total_score(match_score: float, expiry_score: float, nutrition_score: float) -> float:
    """
    최종 추천 점수 계산
    totalScore = (matchScore × 0.4) + (expiryScore × 0.3) + (nutritionScore × 0.3)
    
    nutrition_score는 0~1 범위이므로 10을 곱해서 다른 점수와 비슷한 스케일로 맞춤
    """
    normalized_nutrition_score = nutrition_score * 10.0
    total_score = (match_score * 0.4) + (expiry_score * 0.3) + (normalized_nutrition_score * 0.3)
    return total_score


def recommend_recipes(db: Session, userId: str) -> List[Dict]:
    """
    사용자 맞춤 레시피 추천
    
    Args:
        db: 데이터베이스 세션
        userId: 사용자 ID
    
    Returns:
        추천 레시피 리스트 (점수 높은 순)
    """
    # 1) 사용자 정보 가져오기
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        return []
    
    # 2) 사용자의 건강 목표 가져오기 (첫 번째 목표 사용)
    user_goal = db.query(UserHealthGoal).filter(UserHealthGoal.userId == userId).first()
    goal_id = user_goal.goalId if user_goal else None
    
    if not goal_id:
        # 건강 목표가 없으면 기본 추천 (매칭 점수만 사용)
        goal_id = None
    
    # 3) 영양소 목표 계산
    nutrition_targets = get_nutrition_targets(goal_id, user) if goal_id else {}
    
    # 4) 사용자 보유 재료 가져오기
    user_foods = db.query(Food).filter(Food.userId == userId).all()
    
    # 5) 모든 레시피 가져오기
    recipes = db.query(Recipe).all()
    
    # 6) 각 레시피에 대해 점수 계산
    results = []
    
    for recipe in recipes:
        # 매칭 점수 계산
        match_score, used_ingredients, missing_ingredients = calculate_match_score(recipe, user_foods)
        
        # 임박 재료 점수 계산
        expiry_score = calculate_expiry_score(recipe, user_foods)
        
        # 영양소 점수 계산
        nutrition_score = calculate_nutrition_score(recipe, nutrition_targets) if nutrition_targets else 0.0
        
        # 최종 점수 계산
        total_score = calculate_total_score(match_score, expiry_score, nutrition_score)
        
        # 결과 구성
        result = {
            "recipeId": recipe.id,
            "recipeName": recipe.recipeName,
            "imageUrl": recipe.imageUrl,
            "time": recipe.time,
            "difficulty": recipe.difficulty,
            "score": round(total_score, 2),
            "matchScore": round(match_score, 2),
            "expiryScore": round(expiry_score, 2),
            "nutritionScore": round(nutrition_score, 2),
            "usedIngredients": used_ingredients,
            "missingIngredients": missing_ingredients,
            "calories": recipe.calories,
            "nutrition": {
                "protein": recipe.protein or 0.0,
                "carbohydrates": recipe.carbohydrates or 0.0,
                "fat": recipe.fat or 0.0,
                "vitaminC": recipe.vitamin_c or 0.0,
                "vitaminD": recipe.vitamin_d or 0.0,
                "zinc": recipe.zinc or 0.0,
            }
        }
        
        results.append(result)
    
    # 7) 점수 높은 순으로 정렬
    results.sort(key=lambda x: x["score"], reverse=True)
    
    return results

