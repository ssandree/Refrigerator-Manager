# app/statistics/statistics_service.py

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, Optional
import math
from app.auth.auth_models import User
from app.meals.meal_models import Meal
from app.meals.meal_services import get_statistics as get_meal_statistics
from app.recipes.recipe_models import Recipe


# -----------------------------
# BMR/TDEE 계산 함수
# -----------------------------

def calculate_bmr(user: User) -> float:
    """
    기초대사량(BMR) 계산 - Mifflin-St Jeor 공식 사용
    BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + (성별 상수)
    """
    weight = getattr(user, 'weight', None) or 70.0  # 기본값 70kg
    age = getattr(user, 'age', None) or 30  # 기본값 30세
    sex = getattr(user, 'sex', '').lower() if getattr(user, 'sex', None) else 'male'
    
    # height가 없으면 BMI와 weight로부터 역산 (기본 BMI 22 사용)
    height = getattr(user, 'height', None)
    if not height:
        bmi = getattr(user, 'bmi', None) or 22.0
        # BMI = weight(kg) / (height(m))^2
        # height(m) = sqrt(weight / BMI)
        # height(cm) = sqrt(weight / BMI) * 100
        height = math.sqrt(weight / bmi) * 100
    
    # Mifflin-St Jeor 공식
    if sex == 'female':
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:  # male (기본값)
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    
    return max(bmr, 0.0)


def calculate_tdee(user: User) -> float:
    """
    총 일일 에너지 소비량(TDEE) 계산
    TDEE = BMR × 활동지수
    """
    bmr = calculate_bmr(user)
    activity_level = getattr(user, 'activity_level', None) or 1.55  # 기본값: 보통 활동
    
    # 활동지수 유효성 검사
    if activity_level not in [1.2, 1.375, 1.55, 1.725, 1.9]:
        activity_level = 1.55  # 기본값 사용
    
    tdee = bmr * activity_level
    return max(tdee, 0.0)


def get_nutrition_targets(goal_id: int, user: User) -> Dict[str, float]:
    """
    건강 목표별 필요 영양소 계산
    
    건강 목표 ID 매핑:
    - 1001: 체중 유지
    - 1002: 체지방 감량 (체중 감량)
    - 1003: 단백질 보충
    - 1004: 체중 증량
    - 1005: 혈당 관리 (혈압 관리와 유사)
    - 1006: 면역력 강화
    - 1007: 체력 유지/향상
    """
    tdee = calculate_tdee(user)
    weight = getattr(user, 'weight', None) or 70.0
    activity_level = getattr(user, 'activity_level', None) or 1.55
    
    targets = {
        'calories': 0.0,
        'protein': 0.0,  # g
        'carbohydrates': 0.0,  # g
        'fat': 0.0,  # g
        'vitamin_c': 0.0,  # mg
        'vitamin_d': 0.0,  # μg (IU로 변환 필요: 1μg = 40IU)
        'zinc': 0.0,  # mg
        'sodium': 0.0,  # mg
    }
    
    if goal_id == 1002:  # 체지방 감량 (체중 감량)
        target_calories = tdee - 300
        targets['calories'] = max(target_calories, 1200.0)  # 최소 칼로리 보장
        # 단백질: 목표칼로리 × 0.20 ~ 0.30 (중간값 0.25 사용)
        targets['protein'] = (target_calories * 0.25) / 4.0  # 1g 단백질 = 4kcal
        # 탄수화물: 목표칼로리 × 0.20 ~ 0.30 (중간값 0.25 사용)
        targets['carbohydrates'] = (target_calories * 0.25) / 4.0  # 1g 탄수화물 = 4kcal
        # 지방: 목표칼로리 × 0.40 ~ 0.55 (중간값 0.475 사용)
        targets['fat'] = (target_calories * 0.475) / 9.0  # 1g 지방 = 9kcal
        
    elif goal_id == 1004:  # 체중 증량
        target_calories = tdee + 300
        targets['calories'] = target_calories
        # 단백질: 체중(kg) × 1.6 ~ 2.2 (중간값 1.9 사용)
        targets['protein'] = weight * 1.9
        # 지방: 목표칼로리 × 0.20 ~ 0.30 (중간값 0.25 사용)
        fat_calories = target_calories * 0.25
        targets['fat'] = fat_calories / 9.0
        # 탄수화물: 나머지
        protein_calories = targets['protein'] * 4.0
        targets['carbohydrates'] = (target_calories - protein_calories - fat_calories) / 4.0
        
    elif goal_id == 1003:  # 단백질 보충
        target_calories = tdee
        targets['calories'] = target_calories
        # 활동지수에 따라 단백질 계산
        if activity_level <= 1.375:
            targets['protein'] = weight * 0.8
        else:  # activity_level >= 1.55
            targets['protein'] = weight * 1.8  # 1.6 ~ 2.0의 중간값
        # 나머지 영양소는 균형있게
        protein_calories = targets['protein'] * 4.0
        remaining_calories = target_calories - protein_calories
        targets['carbohydrates'] = (remaining_calories * 0.5) / 4.0
        targets['fat'] = (remaining_calories * 0.5) / 9.0
        
    elif goal_id == 1006:  # 면역력 강화
        target_calories = tdee
        targets['calories'] = target_calories
        targets['protein'] = weight * 1.4
        # 지방: 목표칼로리 × 0.27
        fat_calories = target_calories * 0.27
        targets['fat'] = fat_calories / 9.0
        # 탄수화물: 나머지
        protein_calories = targets['protein'] * 4.0
        targets['carbohydrates'] = (target_calories - protein_calories - fat_calories) / 4.0
        # 비타민 및 미네랄
        targets['vitamin_c'] = 150.0  # mg
        targets['vitamin_d'] = 37.5  # μg (1500IU / 40)
        targets['zinc'] = 10.0  # mg
        
    elif goal_id == 1005:  # 혈당 관리 (혈압 관리와 유사)
        target_calories = tdee
        targets['calories'] = target_calories
        targets['protein'] = weight * 1.2
        # 나트륨 제한 (일반 권장량보다 낮게)
        targets['sodium'] = 2000.0  # mg (일반 권장량 2300mg보다 낮게)
        # 균형잡힌 영양소
        protein_calories = targets['protein'] * 4.0
        remaining_calories = target_calories - protein_calories
        targets['carbohydrates'] = (remaining_calories * 0.5) / 4.0
        targets['fat'] = (remaining_calories * 0.5) / 9.0
        
    elif goal_id == 1007:  # 체력 유지/향상
        target_calories = tdee
        targets['calories'] = target_calories
        targets['protein'] = weight * 1.6
        # 복합 탄수화물 중심
        protein_calories = targets['protein'] * 4.0
        remaining_calories = target_calories - protein_calories
        targets['carbohydrates'] = (remaining_calories * 0.6) / 4.0  # 탄수화물 비중 높게
        targets['fat'] = (remaining_calories * 0.4) / 9.0
        
    else:  # 기본값 (체중 유지 등)
        target_calories = tdee
        targets['calories'] = target_calories
        targets['protein'] = weight * 1.2
        protein_calories = targets['protein'] * 4.0
        remaining_calories = target_calories - protein_calories
        targets['carbohydrates'] = (remaining_calories * 0.5) / 4.0
        targets['fat'] = (remaining_calories * 0.5) / 9.0
    
    return targets


# -----------------------------
# 통계 조회 함수
# -----------------------------

def _get_meals_with_recipes(db: Session, user_id: str, start_date=None, end_date=None):
    """
    Meal과 Recipe를 LEFT JOIN하여 조회
    영양 통계는 무조건 meal 테이블을 기준으로 계산해야 함
    recipeId가 NULL인 meal도 포함됨
    """
    query = (
        db.query(Meal, Recipe)
        .outerjoin(Recipe, Meal.recipeId == Recipe.id)  # LEFT JOIN 사용
        .filter(Meal.userId == user_id)
    )

    if start_date:
        query = query.filter(Meal.consumedAt >= start_date)
    if end_date:
        query = query.filter(Meal.consumedAt <= end_date)

    return query.all()


def calc_meal_calories(meal: Meal, recipe: Recipe):
    """식사의 칼로리 계산"""
    if not recipe:
        return 0
    return recipe.calories if recipe.calories else 0


def calc_meal_nutrition(meal: Meal, recipe: Recipe):
    """식사의 영양소 계산"""
    if not recipe:
        return {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "vitamin_c": 0,
            "vitamin_d": 0,
            "zinc": 0
        }

    return {
        "calories": recipe.calories or 0,
        "protein": recipe.protein or 0,
        "carbs": recipe.carbohydrates or 0,
        "fat": recipe.fat or 0,
        "vitamin_c": recipe.vitamin_c or 0,
        "vitamin_d": recipe.vitamin_d or 0,
        "zinc": recipe.zinc or 0
    }


def _parse_date(value: Optional[str]) -> datetime:
    if not value:
        return datetime.utcnow()
    try:
        return datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        return datetime.strptime(value.split('T')[0], "%Y-%m-%d")


def daily_health_stats(db: Session, userId: str, date_str: Optional[str]):
    """특정 날짜의 건강 통계"""
    target = _parse_date(date_str)
    day = target.date()

    day_start = datetime(day.year, day.month, day.day, 0, 0, 0)
    day_end = datetime(day.year, day.month, day.day, 23, 59, 59)

    # Meal과 Recipe를 JOIN하여 조회 (meal 테이블 기준)
    meal_recipe_pairs = _get_meals_with_recipes(db, userId, day_start, day_end)

    macros = {
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "vitamin_c": 0,
        "vitamin_d": 0,
        "zinc": 0
    }
    meal_history = []

    for meal, recipe in meal_recipe_pairs:
        nutrition = calc_meal_nutrition(meal, recipe)
        for key in macros.keys():
            macros[key] += nutrition.get(key, 0)

        meal_history.append({
            "id": meal.id,
            "consumedAt": meal.consumedAt.isoformat(),
            "mealType": meal.mealType,
            "notes": meal.notes,
            "recipeId": meal.recipeId,
        })

    return {
        "date": day.strftime("%Y-%m-%d"),
        "calories": macros["calories"],
        "macros": macros,
        "mealCount": len(meal_recipe_pairs),
        "mealHistory": meal_history,
    }


def weekly_health_stats(db: Session, userId: str, start_date: str):
    """주간 건강 통계"""
    start = datetime.fromisoformat(start_date)
    end = start + timedelta(days=6)

    # Meal과 Recipe를 JOIN하여 조회 (meal 테이블 기준)
    meal_recipe_pairs = _get_meals_with_recipes(db, userId, start, end)

    daily_stats = []
    total_calories = 0
    total_meals = 0

    for i in range(7):
        day = start + timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0)
        day_end = day.replace(hour=23, minute=59, second=59)

        # 해당 날짜의 meal-recipe 쌍 필터링
        day_meals = [
            (m, r) for m, r in meal_recipe_pairs
            if day_start <= m.consumedAt <= day_end
        ]

        day_calories = sum(calc_meal_calories(m, r) for m, r in day_meals)

        daily_stats.append({
            "date": day.strftime("%Y-%m-%d"),
            "calories": day_calories,
            "meals": len(day_meals),
            "goalsAchieved": False  # 목표 달성 로직 없음 → false
        })

        total_calories += day_calories
        total_meals += len(day_meals)

    return {
        "startDate": start_date,
        "endDate": end.strftime("%Y-%m-%d"),
        "dailyStats": daily_stats,
        "weeklyTotal": {
            "totalCalories": total_calories,
            "totalMeals": total_meals,
            "averageCalories": total_calories / 7 if total_meals > 0 else 0,
            "goalsAchievedDays": 0
        }
    }


def nutrition_stats(db: Session, userId: str, start_date: str, end_date: str):
    """영양소 통계"""
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)

    # Meal과 Recipe를 JOIN하여 조회 (meal 테이블 기준)
    meal_recipe_pairs = _get_meals_with_recipes(db, userId, start, end)

    total = {
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "vitamin_c": 0,
        "vitamin_d": 0,
        "zinc": 0
    }
    daily_breakdown = []

    days = (end - start).days + 1

    for i in range(days):
        day = start + timedelta(days=i)
        # 해당 날짜의 meal-recipe 쌍 필터링
        day_meals = [
            (m, r) for m, r in meal_recipe_pairs
            if m.consumedAt.date() == day.date()
        ]

        day_stats = {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "vitamin_c": 0,
            "vitamin_d": 0,
            "zinc": 0
        }

        for m, r in day_meals:
            nut = calc_meal_nutrition(m, r)
            for k in total.keys():
                day_stats[k] += nut[k]
                total[k] += nut[k]

        daily_breakdown.append({
            "date": day.strftime("%Y-%m-%d"),
            **day_stats
        })

    average = {k: total[k] / days for k in total.keys()}

    return {
        "period": {
            "startDate": start_date,
            "endDate": end_date
        },
        "total": total,
        "average": average,
        "dailyBreakdown": daily_breakdown
    }

def calculate_combined_nutrition_targets(db: Session, userId: str):
    """
    사용자가 선택한 최대 3개의 건강 목표를 기반으로
    하루 영양소 목표치를 계산하여 통합 반환.
    """
    # User 객체 조회
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        return {"message": "User not found"}

    # 사용자 목표 1~3개 가져오기
    from app.health_goals.health_services import get_user_goals
    user_goals = get_user_goals(db, userId)

    if not user_goals:
        return {"message": "No health goals selected"}

    # 각 목표별 target 계산
    target_list = []
    for goal in user_goals:
        t = get_nutrition_targets(goal["id"], user)
        target_list.append(t)

    # 평균 방식으로 통합
    combined = {}
    keys = target_list[0].keys()

    for k in keys:
        combined[k] = sum(t[k] for t in target_list) / len(target_list)

    return {
        "goalCount": len(user_goals),
        "goals": [g["id"] for g in user_goals],
        "targets": combined
    }


__all__ = [
    "get_meal_statistics",
    "calculate_bmr",
    "calculate_tdee",
    "get_nutrition_targets",
    "daily_health_stats",
    "weekly_health_stats",
    "nutrition_stats",
    "calculate_combined_nutrition_targets",
]
