from pydantic import BaseModel
from typing import List, Optional

class RecipeBase(BaseModel):
    recipeName: str
    calories: int
    time: int
    healthGoal: Optional[int]
    timeCategory: Optional[str]
    imageUrl: Optional[str]
    difficulty: Optional[str]
    description: Optional[str]
    requiredfoods: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    calories_per_gram: Optional[float] = None
    carbohydrates: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    sodium: Optional[float] = None
    vitamin_c: Optional[float] = None
    vitamin_d: Optional[float] = None
    zinc: Optional[float] = None

class RecipeResponse(RecipeBase):
    id: str

    class Config:
        from_attributes = True


# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class SingleRecipeResponse(BaseResponse):
    data: RecipeResponse


class RecipeListResponse(BaseResponse):
    data: List[RecipeResponse]


class DeleteResponse(BaseResponse):
    message: str

