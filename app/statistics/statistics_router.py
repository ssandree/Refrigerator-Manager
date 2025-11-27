from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.dependencies import get_current_user

from app.statistics.statistics_schemas import HealthStatsResponse, BaseResponse
from app.statistics.statistics_service import (
    get_meal_statistics,
    daily_health_stats,
    weekly_health_stats,
    nutrition_stats,
    calculate_combined_nutrition_targets,
)

router = APIRouter(
    prefix="/statistics",
    tags=["Statistics"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Meal Statistics
# -----------------------------
@router.get("/meals", response_model=BaseResponse)
def meal_statistics(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = get_meal_statistics(db, userId)
    return BaseResponse(success=True, data=data)


# -----------------------------
# Daily Stats
# -----------------------------
@router.get("/daily", response_model=HealthStatsResponse)
def daily_stats(
    date: str | None = Query(
        default=None,
        description="통계를 조회할 날짜 (ISO 포맷, 기본값: 오늘)"
    ),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = daily_health_stats(db, userId, date)
    return HealthStatsResponse(success=True, data=data)


# -----------------------------
# Weekly Stats
# -----------------------------
@router.get("/weekly", response_model=HealthStatsResponse)
def weekly_stats(
    startDate: str = Query(..., description="주간 통계를 시작할 날짜 (ISO 포맷)"),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = weekly_health_stats(db, userId, startDate)
    return HealthStatsResponse(success=True, data=data)


# -----------------------------
# Nutrition Stats
# -----------------------------
@router.get("/nutrition", response_model=HealthStatsResponse)
def nutrition_stats_endpoint(
    startDate: str = Query(..., description="기간 시작 날짜 (ISO 포맷)"),
    endDate: str = Query(..., description="기간 종료 날짜 (ISO 포맷)"),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = nutrition_stats(db, userId, startDate, endDate)
    return HealthStatsResponse(success=True, data=data)


# -----------------------------
# Combined Nutrition Targets
# -----------------------------
@router.get("/combined-targets", response_model=HealthStatsResponse)
def combined_nutrition_targets(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = calculate_combined_nutrition_targets(db, userId)
    return HealthStatsResponse(success=True, data=data)