from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Integer, Float
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base
from app.core.datetime_utils import get_kst_now

class Meal(Base):
    __tablename__ = "meals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    userId = Column(String(36), ForeignKey("users.id"), nullable=False)
    recipeId = Column(String(36), ForeignKey("recipes.id"), nullable=True)

    foodIds = Column(JSON, default=list)  # ["ing-1", "ing-2"]
    quantity = Column(String(50), nullable=True)

    consumedAt = Column(DateTime, nullable=False)
    registeredAt = Column(DateTime, default=get_kst_now)

    notes = Column(String(500), nullable=True)
    mealType = Column(String(20), nullable=True)  # breakfast, lunch, dinner, snack

    # 영양소 정보
    calories = Column(Integer, nullable=True)
    carbohydrates = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    vitamin_c = Column(Float, nullable=True)
    vitamin_d = Column(Float, nullable=True)
    zinc = Column(Float, nullable=True)

