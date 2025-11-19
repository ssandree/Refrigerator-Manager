from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    relatedfoodId: Optional[str]
    relatedRecipeId: Optional[str]
    read: bool
    createdAt: datetime

    class Config:
        from_attributes = True

