from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
import uuid
from app.core.database import Base
from app.core.datetime_utils import get_kst_now

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    userId = Column(String(36), ForeignKey("users.id"), nullable=False)

    type = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(String(1000), nullable=False)

    relatedfoodId = Column(String(36), nullable=True)
    relatedRecipeId = Column(String(36), nullable=True)

    read = Column(Boolean, default=False)

    createdAt = Column(DateTime, default=get_kst_now)

