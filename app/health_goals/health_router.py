# app/health_goals/health_router.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user

from app.health_goals.health_schemas import (
    HealthGoalListResponse,
    HealthGoalResponse,
    SetUserGoalsRequest
)

from app.health_goals.health_services import (
    get_user_goals,
    get_user_goal_statistics,
    set_user_goals
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
# Set user's selected goals
# ----------------------------------------
@router.post("/user-selected", response_model=HealthGoalListResponse)
def set_selected_goals(
    request: SetUserGoalsRequest,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """사용자가 선택한 건강 목표 설정"""
    goals = set_user_goals(db, userId, request.goalIds)
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
