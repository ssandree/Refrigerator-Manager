from pydantic import BaseModel
from typing import Dict, Any, Optional

# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class HealthStatsResponse(BaseResponse):
    data: Dict[str, Any]

