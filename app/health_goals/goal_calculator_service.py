# app/health_goals/goal_calculator_service.py

from typing import Dict, Iterable

from app.auth.auth_models import User
from app.statistics.statistics_service import calculate_tdee
from app.recipes.recipe_models import Recipe


def calc_1001(user: User) -> Dict[str, float]:
    """체중 유지"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70

    protein = weight * 1.2
    protein_cal = protein * 4
    fat_cal = (tdee - protein_cal) * 0.3
    carbs_cal = tdee - protein_cal - fat_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": carbs_cal / 4,
        "fat": fat_cal / 9,
    }


def calc_1002(user: User) -> Dict[str, float]:
    """체지방 감량"""
    tdee = calculate_tdee(user) - 300
    tdee = max(tdee, 1200)
    weight = user.weight or 70

    protein = (tdee * 0.25) / 4
    carbs = (tdee * 0.25) / 4
    fat = (tdee * 0.475) / 9

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": carbs,
        "fat": fat,
    }


def calc_1003(user: User) -> Dict[str, float]:
    """단백질 보충"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70
    activity = getattr(user, "activity_level", 1.55)

    protein = weight * (0.8 if activity <= 1.375 else 1.8)
    protein_cal = protein * 4
    rest = tdee - protein_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": (rest * 0.5) / 4,
        "fat": (rest * 0.5) / 9,
    }


def calc_1004(user: User):
    """체중 증량"""
    tdee = calculate_tdee(user) + 300
    weight = user.weight or 70

    protein = weight * 1.9
    protein_cal = protein * 4
    fat_cal = tdee * 0.25
    carbs_cal = tdee - protein_cal - fat_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": carbs_cal / 4,
        "fat": fat_cal / 9,
    }


def calc_1005(user: User):
    """혈당 관리"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70

    protein = weight * 1.2
    protein_cal = protein * 4
    rest = tdee - protein_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": (rest * 0.5) / 4,
        "fat": (rest * 0.5) / 9,
        "sodium": 2000,
    }


def calc_1006(user: User):
    """면역력 강화"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70

    protein = weight * 1.4
    protein_cal = protein * 4
    fat_cal = tdee * 0.27
    carbs_cal = tdee - protein_cal - fat_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": carbs_cal / 4,
        "fat": fat_cal / 9,
        "vitamin_c": 150,
        "vitamin_d": 37.5,
        "zinc": 10,
    }


def calc_1007(user: User):
    """체력 유지/향상"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70

    protein = weight * 1.6
    protein_cal = protein * 4
    rest = tdee - protein_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": (rest * 0.6) / 4,
        "fat": (rest * 0.4) / 9,
    }


GOAL_CALCULATORS = {
    1001: calc_1001,
    1002: calc_1002,
    1003: calc_1003,
    1004: calc_1004,
    1005: calc_1005,
    1006: calc_1006,
    1007: calc_1007,
}


# ----------------------------------------
# 레시피 vs 건강 목표 매칭 점수 계산 헬퍼
# ----------------------------------------

# 건강 목표 매칭이 어느 정도 이상일 때만 matchedGoals에 넣을지 기준
GOAL_MATCH_THRESHOLD = 0.5  # 0~1

# 이 키들 기준으로 레시피/목표를 비교
NUTRIENT_KEYS = [
    "calories",
    "protein",
    "carbohydrates",
    "fat",
    "sodium",
    "vitamin_c",
    "vitamin_d",
    "zinc",
]


def get_goal_targets_for_user(
    user: User, goal_ids: Iterable[int]
) -> Dict[int, Dict[str, float]]:
    """
    유저와 goal id 리스트를 받아서
    각 goal_id 별로 {calories, protein, ...} 목표값 dict를 리턴.
    """
    targets: Dict[int, Dict[str, float]] = {}
    for goal_id in goal_ids:
        calc = GOAL_CALCULATORS.get(goal_id)
        if not calc:
            continue
        targets[goal_id] = calc(user)
    return targets


def _score_recipe_against_target(
    recipe: Recipe, target: Dict[str, float]
) -> float:
    """
    레시피 한 개가 '하루 목표' target 을 얼마나 잘 만족하는지 0~1 점수.
    (대략 1/3 끼 분량을 기준으로 비교)
    """
    scores: list[float] = []

    for key in NUTRIENT_KEYS:
        target_val = target.get(key)
        if not target_val:
            continue

        recipe_val = getattr(recipe, key, None)
        if recipe_val is None:
            continue

        # 하루 목표를 3끼로 나눠서 한 끼 기준으로 비교
        per_meal_target = target_val / 3.0
        if per_meal_target <= 0:
            continue

        ratio = recipe_val / per_meal_target  # 1이면 딱 목표치
        diff = abs(ratio - 1.0)

        # diff=0 → 1점, diff=1 → 0점, 그 사이 선형
        nutrient_score = max(1.0 - diff, 0.0)
        scores.append(nutrient_score)

    if not scores:
        return 0.0

    return sum(scores) / len(scores)


def calc_goal_match_for_recipe(
    recipe: Recipe, user: User, goal_ids: Iterable[int]
) -> Dict[int, float]:
    """
    recipe가 각 goal을 얼마나 만족하는지 {goal_id: score(0~1)} 반환.
    """
    targets = get_goal_targets_for_user(user, goal_ids)
    return {
        goal_id: _score_recipe_against_target(recipe, target)
        for goal_id, target in targets.items()
    }
