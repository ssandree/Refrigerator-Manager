from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
import uuid
from datetime import datetime
from app.core.database import Base

class Food(Base):
    __tablename__ = "foods"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    userId = Column(String, ForeignKey("users.id"), nullable=False)

    imageUrl = Column(String)
    category = Column(String, nullable=False)
    name = Column(String, nullable=False)
    quantity = Column(Integer)
    weight = Column(String)
    registeredAt = Column(DateTime, default=datetime.utcnow)
    purchaseDate = Column(Date, nullable=True)
    expiryDate = Column(Date, nullable=True)
    storageLocation = Column(String)
    alertBeforeDays = Column(Integer)

