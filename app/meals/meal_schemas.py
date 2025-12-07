from pydantic import BaseModel, field_validator, Field
from typing import List, Optional
from datetime import datetime
from app.meals.meal_constants import MealType, VALID_MEAL_TYPES

class MealCreate(BaseModel):
    recipeId: Optional[str] = None
    foodIds: List[str] = Field(default_factory=list)
    quantity: Optional[str] = None
    consumedAt: datetime
    notes: Optional[str] = None
    mealType: Optional[MealType] = None
    calories: Optional[int] = None
    carbohydrates: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    sodium: Optional[float] = None
    vitamin_c: Optional[float] = None
    vitamin_d: Optional[float] = None
    zinc: Optional[float] = None

    @field_validator('mealType', mode='before')
    @classmethod
    def validate_meal_type(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            if v not in VALID_MEAL_TYPES:
                raise ValueError(f"mealType must be one of {VALID_MEAL_TYPES}")
            return MealType(v)
        return v

class MealUpdate(BaseModel):
    consumedAt: Optional[datetime] = None
    quantity: Optional[str] = None
    notes: Optional[str] = None
    mealType: Optional[MealType] = None
    calories: Optional[int] = None
    carbohydrates: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    sodium: Optional[float] = None
    vitamin_c: Optional[float] = None
    vitamin_d: Optional[float] = None
    zinc: Optional[float] = None

    @field_validator('mealType', mode='before')
    @classmethod
    def validate_meal_type(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            if v not in VALID_MEAL_TYPES:
                raise ValueError(f"mealType must be one of {VALID_MEAL_TYPES}")
            return MealType(v)
        return v

class MealResponse(BaseModel):
    id: str
    recipeId: Optional[str]
    foodIds: List[str]
    quantity: Optional[str]
    consumedAt: datetime
    registeredAt: datetime
    notes: Optional[str]
    mealType: Optional[str]  # DB에서 문자열로 저장되므로 str로 반환
    calories: Optional[int]
    carbohydrates: Optional[float]
    protein: Optional[float]
    fat: Optional[float]
    sodium: Optional[float]
    vitamin_c: Optional[float]
    vitamin_d: Optional[float]
    zinc: Optional[float]

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

