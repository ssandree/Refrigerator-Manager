# recipe_models.py

from sqlalchemy import Column, String, Integer, Float, JSON
import uuid
from app.core.database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recipeName = Column(String(200), nullable=False)

    calories = Column(Integer, nullable=False)
    healthGoal = Column(Integer, nullable=True)
    imageUrl = Column(String(1000), nullable=True)
    sourceUrl = Column(String(1000), nullable=True)  # ⭐ 추가
    requiredfoods = Column(JSON, default=list)

    carbohydrates = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    vitamin_c = Column(Float, nullable=True)
    vitamin_d = Column(Float, nullable=True)
    zinc = Column(Float, nullable=True)
