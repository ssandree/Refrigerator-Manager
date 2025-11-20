from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.health_goals.health_schemas import (
    HealthGoalResponse,
    SetUserGoalsRequest,
    SingleHealthGoalResponse,
    HealthGoalListResponse,
    DeleteResponse
)
from app.health_goals.health_services import (
    get_all_goals,
    get_goal_by_id,
    get_user_goals,
    set_user_goals,
    add_user_goal,
    remove_user_goal,
    get_user_goal_statistics
)

router = APIRouter(
    prefix="/health-goals",
    tags=["Health Goals"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=HealthGoalListResponse)
def find_all(db: Session = Depends(get_db)):
    goals = get_all_goals(db)
    return HealthGoalListResponse(
        data=[HealthGoalResponse.model_validate(goal) for goal in goals]
    )


# -----------------------------
# Read - One
# -----------------------------
@router.get("/{goalId}", response_model=SingleHealthGoalResponse)
def find_one(goalId: int, db: Session = Depends(get_db)):
    goal = get_goal_by_id(db, goalId)
    if not goal:
        raise HTTPException(status_code=404, detail="HEALTH_GOAL_NOT_FOUND")
    return SingleHealthGoalResponse(data=HealthGoalResponse.model_validate(goal))


# -----------------------------
# Read - User Selected
# -----------------------------
@router.get("/user-selected", response_model=HealthGoalListResponse)
def find_user_selected(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    goals = get_user_goals(db, userId)
    return HealthGoalListResponse(
        data=[HealthGoalResponse.model_validate(goal) for goal in goals]
    )


# -----------------------------
# Update - Set User Goals
# -----------------------------
@router.post("/user-selected", response_model=HealthGoalListResponse)
def set_user_selected(
    req: SetUserGoalsRequest, 
    userId=Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    goals = set_user_goals(db, userId, req.goalIds)
    return HealthGoalListResponse(
        data=[HealthGoalResponse.model_validate(goal) for goal in goals]
    )


# -----------------------------
# Create - Add User Goal
# -----------------------------
@router.post("/user-selected/{goalId}", response_model=SingleHealthGoalResponse)
def add_user_goal_api(goalId: int, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    goal = add_user_goal(db, userId, goalId)
    if not goal:
        raise HTTPException(status_code=404, detail="HEALTH_GOAL_NOT_FOUND")
    return SingleHealthGoalResponse(data=HealthGoalResponse.model_validate(goal))


# -----------------------------
# Delete - Remove User Goal
# -----------------------------
@router.delete("/user-selected/{goalId}", response_model=DeleteResponse)
def remove_goal_api(goalId: int, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    removed = remove_user_goal(db, userId, goalId)
    if not removed:
        raise HTTPException(status_code=404, detail="GOAL_NOT_SELECTED")
    return DeleteResponse(message="건강 목표가 제거되었습니다")


# -----------------------------
# Statistics
# -----------------------------
@router.get("/user-statistics")
def stats(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = get_user_goal_statistics(db, userId)
    return {"success": True, "data": data}
