from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.health_goals.models import HealthGoal, UserHealthGoal
from app.meals.models import Meal
from app.recipes.models import Recipe


def get_all_goals(db: Session):
    return db.query(HealthGoal).all()


def get_goal_by_id(db: Session, goalId: int):
    return db.query(HealthGoal).filter(HealthGoal.id == goalId).first()


def get_user_goals(db: Session, userId: str):
    joins = db.query(HealthGoal).join(
        UserHealthGoal, UserHealthGoal.goalId == HealthGoal.id
    ).filter(
        UserHealthGoal.userId == userId
    ).all()

    return joins


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
    exists = db.query(UserHealthGoal).filter(
        UserHealthGoal.userId == userId, 
        UserHealthGoal.goalId == goalId
    ).first()

    if exists:
        return exists

    newGoal = UserHealthGoal(userId=userId, goalId=goalId)
    db.add(newGoal)
    db.commit()
    db.refresh(newGoal)
    return newGoal


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
    return recipe.nutritionInfo["calories"] if recipe and recipe.nutritionInfo else 0


def calc_meal_nutrition(meal: Meal, recipe_lookup):
    recipe = recipe_lookup.get(meal.recipeId)

    if not recipe or not recipe.nutritionInfo:
        return {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

    return recipe.nutritionInfo


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

