from pydantic import BaseModel
from typing import Optional

# -----------------------------
# Response Schemas
# -----------------------------

class NutritionInfo(BaseModel):
    calories: int
    protein: int
    carbs: int
    fat: int


class DashboardData(BaseModel):
    todayNutrition: NutritionInfo
    mealCount: int


# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class DashboardResponse(BaseResponse):
    data: DashboardData

