from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MealCreate(BaseModel):
    recipeId: Optional[str] = None
    foodIds: List[str]
    quantity: Optional[str]
    consumedAt: datetime
    notes: Optional[str] = None
    mealType: Optional[str] = None

class MealUpdate(BaseModel):
    quantity: Optional[str]
    notes: Optional[str]
    mealType: Optional[str]

class MealResponse(BaseModel):
    id: str
    recipeId: Optional[str]
    foodIds: List[str]
    quantity: Optional[str]
    consumedAt: datetime
    registeredAt: datetime
    notes: Optional[str]
    mealType: Optional[str]

    class Config:
        from_attributes = True


# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class SingleMealResponse(BaseResponse):
    data: MealResponse


class MealListResponse(BaseResponse):
    data: List[MealResponse]


class DeleteResponse(BaseResponse):
    message: str

