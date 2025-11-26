# app/dashboard/dashboard_schemas.py

from pydantic import BaseModel
from typing import Optional, List


# -----------------------------
# Nutrition Info
# -----------------------------
class TodayNutrition(BaseModel):
    calories: int
    protein: int
    carbs: int
    fat: int


# -----------------------------
# Home Dashboard
# -----------------------------
class HomeDashboard(BaseModel):
    expiringIngredients: List[dict]
    recipeRecommendations: List[dict]
    todayMeals: List[dict]
    todayNutrition: TodayNutrition


# -----------------------------
# Response Wrapper
# -----------------------------
class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class HomeDashboardResponse(BaseResponse):
    data: HomeDashboard
