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
    calories_per_gram: float | None = None
    carbohydrates: float | None = None
    protein: float | None = None
    fat: float | None = None
    sodium: float | None = None
    vitamin_c: float | None = None
    vitamin_d: float | None = None
    zinc: float | None = None

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
    calories_per_gram: float | None = None
    carbohydrates: float | None = None
    protein: float | None = None
    fat: float | None = None
    sodium: float | None = None
    vitamin_c: float | None = None
    vitamin_d: float | None = None
    zinc: float | None = None

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
    calories_per_gram: float | None
    carbohydrates: float | None
    protein: float | None
    fat: float | None
    sodium: float | None
    vitamin_c: float | None
    vitamin_d: float | None
    zinc: float | None

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

