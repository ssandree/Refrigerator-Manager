from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base

class Meal(Base):
    __tablename__ = "meals"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    userId = Column(String, ForeignKey("users.id"), nullable=False)
    recipeId = Column(String, ForeignKey("recipes.id"), nullable=True)

    foodIds = Column(JSON, default=list)  # ["ing-1", "ing-2"]
    quantity = Column(String, nullable=True)

    consumedAt = Column(DateTime, nullable=False)
    registeredAt = Column(DateTime, default=datetime.utcnow)

    notes = Column(String, nullable=True)
    mealType = Column(String, nullable=True)  # breakfast, lunch, dinner, snack

