from pydantic import BaseModel
from typing import List, Optional


class RecipeBase(BaseModel):
    recipeName: str
    calories: int
    healthGoal: Optional[int]
    imageUrl: Optional[str]
    # 항상 List[str] 형태로 내려줄 거라서 이렇게 정의
    requiredfoods: Optional[List[str]] = []
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


class RecommendResponse(BaseResponse):
    data: List[RecommendItem]
