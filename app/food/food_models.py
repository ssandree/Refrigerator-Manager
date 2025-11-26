from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
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

