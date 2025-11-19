from pydantic import BaseModel
from datetime import date, datetime

class FoodCreate(BaseModel):
    imageUrl: str | None = None
    category: str
    name: str
    quantity: int | None
    weight: str | None
    purchaseDate: date | None
    expiryDate: date | None
    storageLocation: str
    alertBeforeDays: int | None

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

