from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.health_goals.health_services import weekly_health_stats, nutrition_stats

router = APIRouter(
    prefix="/health-goals/stats",
    tags=["Health Statistics"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Weekly Stats
# -----------------------------
@router.get("/weekly")
def weekly(
    startDate: str = Query(..., description="시작 날짜"), 
    userId=Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return {"success": True, "data": weekly_health_stats(db, userId, startDate)}


# -----------------------------
# Nutrition Stats
# -----------------------------
@router.get("/nutrition")
def nutrition(
    startDate: str = Query(..., description="시작 날짜"), 
    endDate: str = Query(..., description="종료 날짜"), 
    userId=Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return {"success": True, "data": nutrition_stats(db, userId, startDate, endDate)}
