from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional

class FoodCreate(BaseModel):
    imageUrl: str | None = None
    category: str
    name: str
    quantity: int | None = None
    weight: str | None = None
    purchaseDate: date | None = None
    expiryDate: date | None = None
    storageLocation: str
    alertBeforeDays: int | None = None

class FoodUpdate(BaseModel):
    imageUrl: str | None = None
    category: str | None = None
    name: str | None = None
    quantity: int | None = None
    weight: str | None = None
    purchaseDate: date | None = None
    expiryDate: date | None = None
    storageLocation: str | None = None
    alertBeforeDays: int | None = None

class FoodResponse(BaseModel):
    id: str
    imageUrl: str | None
    category: str
    name: str
    quantity: int | None
    weight: str | None
    registeredAt: datetime
    purchaseDate: date | None
    expiryDate: date | None
    storageLocation: str
    alertBeforeDays: int | None

    class Config:
        from_attributes = True


# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class SingleFoodResponse(BaseResponse):
    data: FoodResponse


class FoodListResponse(BaseResponse):
    data: List[FoodResponse]


class DeleteResponse(BaseResponse):
    message: str


class BulkDeleteRequest(BaseModel):
    foodIds: List[str]


class BulkDeleteResponse(BaseResponse):
    deletedCount: int
    message: str

