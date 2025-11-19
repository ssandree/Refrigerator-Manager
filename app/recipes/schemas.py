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

class RecipeResponse(RecipeBase):
    id: str

    class Config:
        from_attributes = True

