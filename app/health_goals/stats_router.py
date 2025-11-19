from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.jwt import get_current_user
from app.health_goals.services import weekly_health_stats, nutrition_stats

router = APIRouter(prefix="/health-stats", tags=["Health Statistics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 1) 주간 건강 통계
@router.get("/weekly")
def weekly(startDate: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    return {"success": True, "data": weekly_health_stats(db, userId, startDate)}


# 2) 영양소 통계
@router.get("/nutrition")
def nutrition(startDate: str, endDate: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    return {"success": True, "data": nutrition_stats(db, userId, startDate, endDate)}

