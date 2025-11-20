from pydantic import BaseModel
from typing import List, Optional, Dict, Any


# -----------------------------
# Response Schemas
# -----------------------------

class RecipeNutritionInfo(BaseModel):
    protein: float
    carbohydrates: float
    fat: float
    vitaminC: float
    vitaminD: float
    zinc: float


class RecommendedRecipeResponse(BaseModel):
    recipeId: str
    recipeName: str
    imageUrl: Optional[str]
    time: int
    difficulty: Optional[str]
    score: float
    matchScore: float
    expiryScore: float
    nutritionScore: float
    usedIngredients: List[str]
    missingIngredients: List[str]
    calories: int
    nutrition: RecipeNutritionInfo


# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class RecipeRecommendationResponse(BaseResponse):
    data: List[RecommendedRecipeResponse]

