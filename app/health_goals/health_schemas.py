from pydantic import BaseModel
from typing import Optional, List

class HealthGoalResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None

    class Config:
        from_attributes = True


class HealthGoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None


class SetUserGoalsRequest(BaseModel):
    goalIds: list[int]


# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class SingleHealthGoalResponse(BaseResponse):
    data: HealthGoalResponse


class HealthGoalListResponse(BaseResponse):
    data: List[HealthGoalResponse]


class DeleteResponse(BaseResponse):
    message: str

