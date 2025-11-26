# app/health_goals/health_router.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user

from app.health_goals.health_schemas import (
    HealthGoalListResponse,
    HealthGoalResponse
)

from app.health_goals.health_services import (
    get_user_goals,
    get_user_goal_statistics
)


router = APIRouter(
    prefix="/health-goals",
    tags=["Health Goals"]
)


# ----------------------------------------
# Read user's selected goals
# ----------------------------------------
@router.get("/user-selected", response_model=HealthGoalListResponse)
def find_user_selected(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goals = get_user_goals(db, userId)
    return HealthGoalListResponse(data=[HealthGoalResponse(**g) for g in goals])


# ----------------------------------------
# Statistics
# ----------------------------------------
@router.get("/user-statistics")
def stats(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {"success": True, "data": get_user_goal_statistics(db, userId)}
