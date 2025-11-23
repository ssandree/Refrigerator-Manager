from pydantic import BaseModel
from typing import Optional


# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class IsFavoriteData(BaseModel):
    isFavorite: bool


class CheckFavoriteResponse(BaseResponse):
    data: IsFavoriteData


class DeleteFavoriteResponse(BaseResponse):
    message: str

