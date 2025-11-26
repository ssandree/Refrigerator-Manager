# app/dashboard/dashboard_router.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.dashboard.dashboard_services import home_dashboard
from app.dashboard.dashboard_schemas import HomeDashboardResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/home", response_model=HomeDashboardResponse)
def home_dashboard_api(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    홈 화면 전용 Dashboard API
    """
    data = home_dashboard(db, userId)
    return HomeDashboardResponse(data=data)
