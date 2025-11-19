from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.jwt import get_current_user
from app.dashboard.services import today_dashboard

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/today")
def today(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    return {"success": True, "data": today_dashboard(db, userId)}

