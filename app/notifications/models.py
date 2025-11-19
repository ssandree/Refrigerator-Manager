from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from datetime import datetime
import uuid
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    userId = Column(String, ForeignKey("users.id"), nullable=False)

    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)

    relatedfoodId = Column(String, nullable=True)
    relatedRecipeId = Column(String, nullable=True)

    read = Column(Boolean, default=False)

    createdAt = Column(DateTime, default=datetime.utcnow)

