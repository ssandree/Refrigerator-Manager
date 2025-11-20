from sqlalchemy import Column, String, Integer, Float, Boolean, JSON
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recipeName = Column(String(200), nullable=False)

    calories = Column(Integer, nullable=False)
    time = Column(Integer, nullable=False)   # 조리 시간(분)
    healthGoal = Column(Integer, nullable=True)
    timeCategory = Column(String(50), nullable=True)

    imageUrl = Column(String(1000), nullable=True)
    difficulty = Column(String(50), nullable=True)
    description = Column(String(1000), nullable=True)

    requiredfoods = Column(JSON, default=list)  # ["토마토", "계란", ...]
    tags = Column(JSON, default=list)                 # ["한식", "매콤"]
    
    # 영양 정보 필드들
    calories_per_gram = Column(Float, nullable=True)
    carbohydrates = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    vitamin_c = Column(Float, nullable=True)
    vitamin_d = Column(Float, nullable=True)
    zinc = Column(Float, nullable=True)

