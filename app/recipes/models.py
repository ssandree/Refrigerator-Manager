from sqlalchemy import Column, String, Integer, Float, Boolean, JSON
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    recipeName = Column(String, nullable=False)

    calories = Column(Integer, nullable=False)
    time = Column(Integer, nullable=False)   # 조리 시간(분)
    healthGoal = Column(Integer, nullable=True)
    timeCategory = Column(String, nullable=True)

    imageUrl = Column(String, nullable=True)
    difficulty = Column(String, nullable=True)
    description = Column(String, nullable=True)

    requiredfoods = Column(JSON, default=list)  # ["토마토", "계란", ...]
    tags = Column(JSON, default=list)                 # ["한식", "매콤"]

