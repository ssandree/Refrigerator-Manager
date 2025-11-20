from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.health_goals.health_models import UserHealthGoal
from app.health_goals.health_constants import HEALTH_GOALS
from app.meals.meal_models import Meal
from app.recipes.recipe_models import Recipe


def get_all_goals(db: Session):
    # health_constants.py의 상수만 반환
    return HEALTH_GOALS


def create_goal(db: Session, goal_data):
    # 목표 생성 불가 - constants만 사용
    raise ValueError("건강 목표는 health_constants.py에서만 관리됩니다.")


def get_goal_by_id(db: Session, goalId: int):
    # health_constants.py에서 찾기
    for goal in HEALTH_GOALS:
        if goal["id"] == goalId:
            return goal
    return None


def get_user_goals(db: Session, userId: str):
    # 사용자가 선택한 goalId 목록 가져오기
    user_goal_ids = [
        ugh.goalId for ugh in db.query(UserHealthGoal).filter(
            UserHealthGoal.userId == userId
        ).all()
    ]
    
    # constants에서 해당하는 목표들 반환
    return [goal for goal in HEALTH_GOALS if goal["id"] in user_goal_ids]


def set_user_goals(db: Session, userId: str, goalIds: list[int]):
    # 기존 목표 삭제
    db.query(UserHealthGoal).filter(UserHealthGoal.userId == userId).delete()

    # 새 목표 Insert
    for gid in goalIds:
        db.add(UserHealthGoal(userId=userId, goalId=gid))

    db.commit()

    # 다시 조회
    return get_user_goals(db, userId)


def add_user_goal(db: Session, userId: str, goalId: int):
    # goalId가 constants에 존재하는지 확인
    goal = get_goal_by_id(db, goalId)
    if not goal:
        return None
    
    exists = db.query(UserHealthGoal).filter(
        UserHealthGoal.userId == userId, 
        UserHealthGoal.goalId == goalId
    ).first()

    if exists:
        # 이미 존재하면 constants에서 반환
        return goal

    newGoal = UserHealthGoal(userId=userId, goalId=goalId)
    db.add(newGoal)
    db.commit()
    
    # constants에서 반환
    return goal


def remove_user_goal(db: Session, userId: str, goalId: int):
    exists = db.query(UserHealthGoal).filter(
        UserHealthGoal.userId == userId,
        UserHealthGoal.goalId == goalId
    ).first()

    if not exists:
        return False

    db.delete(exists)
    db.commit()
    return True


def get_user_goal_statistics(db: Session, userId: str):
    count = db.query(UserHealthGoal).filter(
        UserHealthGoal.userId == userId
    ).count()

    # 명세서는 목표 달성도(goal achieved)까지 있지만
    # 아직 달성 기록이 없으므로 기본 구조:
    return {
        "selectedGoals": count,
        "goalsAchieved": 0,
        "achievementRate": 0.0
    }


def get_meals_between(db: Session, userId: str, start, end):
    return db.query(Meal).filter(
        Meal.userId == userId,
        Meal.consumedAt >= start,
        Meal.consumedAt <= end
    ).all()


def calc_meal_calories(meal: Meal, recipe_lookup):
    recipe = recipe_lookup.get(meal.recipeId)
    if not recipe:
        return 0
    return recipe.calories or 0


def calc_meal_nutrition(meal: Meal, recipe_lookup):
    recipe = recipe_lookup.get(meal.recipeId)

    if not recipe:
        return {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

    return {
        "calories": recipe.calories or 0,
        "protein": recipe.protein or 0,
        "carbs": recipe.carbohydrates or 0,
        "fat": recipe.fat or 0
    }


def weekly_health_stats(db: Session, userId: str, start_date: str):
    start = datetime.fromisoformat(start_date)
    end = start + timedelta(days=6)

    meals = get_meals_between(db, userId, start, end)

    # Recipe lookup optimization
    recipes = {r.id: r for r in db.query(Recipe).all()}

    daily_stats = []
    total_calories = 0
    total_meals = 0

    for i in range(7):
        day = start + timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0)
        day_end = day.replace(hour=23, minute=59, second=59)

        day_meals = [
            m for m in meals if day_start <= m.consumedAt <= day_end
        ]

        day_calories = sum(calc_meal_calories(m, recipes) for m in day_meals)

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
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)

    meals = get_meals_between(db, userId, start, end)
    recipes = {r.id: r for r in db.query(Recipe).all()}

    total = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
    daily_breakdown = []

    days = (end - start).days + 1

    for i in range(days):
        day = start + timedelta(days=i)
        day_meals = [
            m for m in meals
            if m.consumedAt.date() == day.date()
        ]

        day_stats = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

        for m in day_meals:
            nut = calc_meal_nutrition(m, recipes)
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

