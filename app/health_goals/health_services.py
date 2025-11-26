# app/health_goals/health_services.py

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.health_goals.health_models import UserHealthGoal
from app.health_goals.health_constants import HEALTH_GOALS, VALID_HEALTH_GOAL_IDS
from app.health_goals.goal_calculator_service import GOAL_CALCULATORS

def get_user_goals(db: Session, userId: str):
    goal_ids = [
        g.goalId for g in db.query(UserHealthGoal)
        .filter(UserHealthGoal.userId == userId).all()
    ]

    return [g for g in HEALTH_GOALS if g["id"] in goal_ids]


def set_user_goals(db: Session, userId: str, goalIds: list[int]):
    if not set(goalIds).issubset(VALID_HEALTH_GOAL_IDS):
        raise HTTPException(400, "Invalid goalIds")

    db.query(UserHealthGoal).filter(UserHealthGoal.userId == userId).delete()

    for gid in goalIds:
        db.add(UserHealthGoal(userId=userId, goalId=gid))

    db.commit()
    return get_user_goals(db, userId)


def get_user_goal_statistics(db: Session, userId: str):
    goals = get_user_goals(db, userId)
    return {
        "selectedGoals": len(goals),
        "achievementRate": 0,  # 추후 계산 가능
    }
