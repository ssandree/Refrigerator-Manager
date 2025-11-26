# app/health_goals/health_schemas.py

from pydantic import BaseModel
from typing import List, Optional

# -----------------------------
# Basic Goal Response
# -----------------------------
class HealthGoalResponse(BaseModel):
    id: int
    title: str

# 사용자가 목표를 여러 개 선택할 때
class HealthGoalListResponse(BaseModel):
    success: bool = True
    data: List[HealthGoalResponse]

# 단일 목표 반환
class SingleHealthGoalResponse(BaseModel):
    success: bool = True
    data: HealthGoalResponse

# Set user goals
class SetUserGoalsRequest(BaseModel):
    goalIds: List[int]

# Delete response
class DeleteResponse(BaseModel):
    success: bool = True
    message: str
