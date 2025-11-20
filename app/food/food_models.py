from sqlalchemy import Column, String, Integer, Float, Date, DateTime, ForeignKey
import uuid
from datetime import datetime
from app.core.database import Base

class Food(Base):
    __tablename__ = "foods"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    userId = Column(String(36), ForeignKey("users.id"), nullable=False)

    imageUrl = Column(String(1000))
    category = Column(String(100), nullable=False)
    name = Column(String(200), nullable=False)
    quantity = Column(Integer)
    weight = Column(String(50))
    registeredAt = Column(DateTime, default=datetime.utcnow)
    purchaseDate = Column(Date, nullable=True)
    expiryDate = Column(Date, nullable=True)
    storageLocation = Column(String(100))
    alertBeforeDays = Column(Integer)
    
    # 영양 정보 필드들
    calories_per_gram = Column(Float, nullable=True)
    carbohydrates = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    vitamin_c = Column(Float, nullable=True)
    vitamin_d = Column(Float, nullable=True)
    zinc = Column(Float, nullable=True)

