from pydantic import BaseModel
from typing import Any, Dict, Optional


class BaseResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    message: Optional[str] = None


class HealthStatsResponse(BaseResponse):
    data: Dict[str, Any]

class NutritionTargetResponse(BaseResponse):
    data: Dict[str, Any]
