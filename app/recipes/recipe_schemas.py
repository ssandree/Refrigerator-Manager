# recipe_schemas.py

from pydantic import BaseModel
from typing import List, Optional


class RecipeBase(BaseModel):
    recipeName: str
    calories: int
    healthGoal: Optional[int]
    imageUrl: Optional[str]
    sourceUrl: Optional[str] = None      # ⭐ 추가
    requiredfoods: Optional[List[str]] = []

    carbohydrates: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    sodium: Optional[float] = None
    vitamin_c: Optional[float] = None
    vitamin_d: Optional[float] = None
    zinc: Optional[float] = None

class GoalMatch(BaseModel):
    id: int
    title: str
    score: float


class RecipeResponse(RecipeBase):
    id: str
    matchedGoals: List[GoalMatch] = []



# -----------------------------
# 공통 Response 스키마
# -----------------------------
class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class SingleRecipeResponse(BaseResponse):
    data: RecipeResponse


class RecipeListResponse(BaseResponse):
    total: int
    data: List[RecipeResponse]


class DeleteResponse(BaseResponse):
    message: str


# -----------------------------
# 추천(Response) 스키마
# -----------------------------
class RecommendItem(BaseModel):
    id: str
    recipeName: str
    foodsOwned: int
    totalFoods: int
    score: float
    # 내부에 score, expiryScore, matchScore, matchedFoods 등 들어있는 dict
    scoreDetails: dict
    imageUrl: Optional[str] = None
    sourceUrl: Optional[str] = None
    requiredfoods: Optional[List[str]] = None
    carbohydrates: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    sodium: Optional[float] = None
    vitamin_c: Optional[float] = None
    vitamin_d: Optional[float] = None
    zinc: Optional[float] = None

    matchedGoals: Optional[List[GoalMatch]] = None


class RecommendResponse(BaseResponse):
    data: List[RecommendItem]
