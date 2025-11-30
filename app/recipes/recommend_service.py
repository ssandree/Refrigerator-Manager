# app/recipes/recommend_service.py

import json
from datetime import datetime
from typing import Dict, List, Any, Optional

from sqlalchemy.orm import Session

from app.food.food_models import Food
from app.recipes.recipe_models import Recipe
from app.auth.auth_models import User
from app.health_goals.health_services import get_user_goals
from app.health_goals.goal_calculator_service import calc_goal_match_for_recipe

# D-Day에 따라 만료 점수
EXPIRY_SCORE_MAP = {
    1: 2.4,
    2: 2.2,
    3: 2.0,
    4: 1.2,
    5: 1.1,
    6: 1.0,
    7: 0.8,
}

# 건강 목표 매칭이 어느 정도 이상일 때만 matchedGoals에 넣을지 기준
GOAL_MATCH_THRESHOLD = 0.5  # 0~1


def calculate_expiry_score(food: Food) -> float:
    """
    유통기한이 가까울수록 높은 점수.
    """
    if not food.expiryDate:
        return 0.0

    today = datetime.utcnow().date()
    dday = (food.expiryDate - today).days

    if dday <= 0:
        # 이미 만료 or 오늘 만료 → 점수 없음
        return 0.0

    return float(EXPIRY_SCORE_MAP.get(dday, 0.0))


def normalize_name(name: str) -> str:
    """
    공백 제거 + 소문자 변환으로 비교용 이름 만들기.
    """
    if not isinstance(name, str):
        return ""
    return "".join(name.split()).lower()


def extract_required_names(requiredfoods_raw: Any) -> List[str]:
    """
    DB에 저장된 requiredfoods(문자열 JSON / 리스트 / dict 리스트)를
    항상 List[str] (재료 이름 리스트)로 변환.
    """
    if not requiredfoods_raw:
        return []

    data: Any

    # 문자열인 경우 → JSON 파싱 시도
    if isinstance(requiredfoods_raw, str):
        try:
            data = json.loads(requiredfoods_raw)
        except Exception:
            # 그냥 "바나나, 꿀, 버터" 같은 문자열이면 쉼표 기준으로 쪼개기
            return [
                s.strip()
                for s in requiredfoods_raw.split(",")
                if isinstance(s, str) and s.strip()
            ]
    else:
        data = requiredfoods_raw

    names: List[str] = []

    if isinstance(data, list):
        for item in data:
            if isinstance(item, str):
                if item.strip():
                    names.append(item.strip())
            elif isinstance(item, dict):
                nm = item.get("name")
                if isinstance(nm, str) and nm.strip():
                    names.append(nm.strip())

    return names


def recommend_recipes(
    db: Session,
    userId: str,
    limit: Optional[int] = None,
):
    """
    - 유저가 가진 식재료(Food)와
    - 레시피(requiredfoods)를 비교해서
    - 만료 임박 + 매칭 개수 기반 점수로 추천 리스트 반환.
    + 각 레시피가 사용자의 건강 목표(영양 기준)를 얼마나 만족하는지도 scoreDetails.matchedGoals 로 제공.
    """
    # 0) 유저 정보 / 선택한 건강 목표
    user: Optional[User] = db.query(User).filter(User.id == userId).first()

    user_goals = get_user_goals(db, userId) if user else []
    selected_goal_ids: List[int] = [g["id"] for g in user_goals]
    goal_title_map: Dict[int, str] = {g["id"]: g["title"] for g in user_goals}

    # 1) 유저 재료 가져오기
    user_foods = db.query(Food).filter(Food.userId == userId).all()

    # 이름(normalize) -> Food
    food_dict: Dict[str, Food] = {}
    for food in user_foods:
        norm = normalize_name(food.name)
        if not norm:
            continue

        # 같은 이름이 여러 개면, 유통기한이 더 이른 걸 우선으로 사용
        if norm not in food_dict:
            food_dict[norm] = food
        else:
            existing = food_dict[norm]
            if food.expiryDate and (
                not existing.expiryDate or food.expiryDate < existing.expiryDate
            ):
                food_dict[norm] = food

    # 2) 모든 레시피 가져오기
    recipes = db.query(Recipe).all()

    result: List[dict] = []

    for recipe in recipes:
        required_names = extract_required_names(recipe.requiredfoods)
        total_required = len(required_names)

        matched_count = 0
        expiry_score_sum = 0.0
        matched_foods: List[dict] = []
        seen_food_keys: set[str] = set()   # 👈 이미 사용한 냉장고 재료 이름들

        for req_name in required_names:
            norm_req = normalize_name(req_name)
            if not norm_req:
                continue

            matched_food_obj: Optional[Food] = None

            # 1) 완전 일치(normalized)
            if norm_req in food_dict:
                matched_food_obj = food_dict[norm_req]
            else:
                # 2) 부분 문자열 매칭 (조금 덜 빡세게)
                for food_key, food_obj in food_dict.items():
                    if norm_req in food_key or food_key in norm_req:
                        matched_food_obj = food_obj
                        break

            if matched_food_obj:
                food_key = normalize_name(matched_food_obj.name)

                # 🔴 여기 추가된 부분: 같은 냉장고 재료는 한 번만 카운트
                if food_key in seen_food_keys:
                    continue
                seen_food_keys.add(food_key)

                matched_count += 1
                score = calculate_expiry_score(matched_food_obj)
                expiry_score_sum += score

                matched_foods.append(
                    {
                        "food": matched_food_obj.name,
                        "expiryScore": score,
                    }
                )

        # 보유 재료 매칭 비율
        match_score = (
            float(matched_count) / float(total_required) if total_required > 0 else 0.0
        )

        # 최종 점수 = 유통기한 점수 합 + 매칭 비율 * 10
        final_score = expiry_score_sum + (match_score * 10.0)

        # 2-bis) 건강 목표 매칭 점수 계산
        matched_goals_details: List[Dict[str, Any]] = []
        if user and selected_goal_ids:
            goal_scores = calc_goal_match_for_recipe(
                recipe, user, selected_goal_ids
            )
            for goal_id, gscore in goal_scores.items():
                if gscore <= 0:
                    continue
                if gscore < GOAL_MATCH_THRESHOLD:
                    continue
                matched_goals_details.append(
                    {
                        "id": goal_id,
                        "title": goal_title_map.get(goal_id),
                        "score": round(gscore, 3),
                    }
                )

            if matched_goals_details:
                matched_goals_details.sort(
                    key=lambda x: x["score"], reverse=True
                )

        # scoreDetails 구성
        score_details: Dict[str, Any] = {
            "score": final_score,
            "expiryScore": expiry_score_sum,
            "calories": recipe.calories,
            "matchScore": match_score,
            "matchedCount": matched_count,
            "totalRequired": total_required,
            "matchedFoods": matched_foods,
        }

        if matched_goals_details:
            score_details["matchedGoals"] = matched_goals_details

        result.append(
            {
                "id": str(recipe.id),
                "recipeName": recipe.recipeName,
                "foodsOwned": matched_count,
                "totalFoods": total_required,
                "score": final_score,
                "scoreDetails": score_details,
                "imageUrl": recipe.imageUrl,
            }
        )

    # 3) 점수 높은 순으로 정렬
    result.sort(key=lambda x: x["score"], reverse=True)

    # 4) limit가 있으면 상위 N개만
    if limit is not None:
        result = result[:limit]

    return result
