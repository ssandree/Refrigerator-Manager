from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.jwt import get_current_user
from app.health_goals.schemas import HealthGoalResponse, SetUserGoalsRequest
from app.health_goals.services import (
    get_all_goals,
    get_goal_by_id,
    get_user_goals,
    set_user_goals,
    add_user_goal,
    remove_user_goal,
    get_user_goal_statistics
)

router = APIRouter(prefix="/health-goals", tags=["Health Goals"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 6.1 모든 목표 조회
@router.get("")
def get_goals(db: Session = Depends(get_db)):
    goals = get_all_goals(db)
    return {"success": True, "data": goals}


# 6.2 건강 목표 상세 조회
@router.get("/{goalId}")
def get_goal(goalId: int, db: Session = Depends(get_db)):
    goal = get_goal_by_id(db, goalId)
    if not goal:
        raise HTTPException(404, "HEALTH_GOAL_NOT_FOUND")
    return {"success": True, "data": goal}


# 6.3 사용자 선택 건강 목표 조회
@router.get("/user-selected")
def get_user_selected(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    goals = get_user_goals(db, userId)
    return {"success": True, "data": goals}


# 6.4 사용자 건강 목표 설정 (전체 SET)
@router.post("/user-selected")
def set_user_selected(req: SetUserGoalsRequest, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    goals = set_user_goals(db, userId, req.goalIds)
    return {"success": True, "data": goals}


# 6.5 건강 목표 하나 추가
@router.post("/user-selected/{goalId}")
def add_user_goal_api(goalId: int, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    goal = add_user_goal(db, userId, goalId)
    return {"success": True, "data": goal}


# 6.6 건강 목표 제거
@router.delete("/user-selected/{goalId}")
def remove_goal_api(goalId: int, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    removed = remove_user_goal(db, userId, goalId)
    if not removed:
        raise HTTPException(404, "GOAL_NOT_SELECTED")
    return {"success": True, "message": "건강 목표가 제거되었습니다"}


# 6.7 사용자 건강 목표 통계 조회
@router.get("/user-statistics")
def stats(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = get_user_goal_statistics(db, userId)
    return {"success": True, "data": data}



