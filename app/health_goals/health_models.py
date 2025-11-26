# app/health_goals/health_models.py

from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class UserHealthGoal(Base):
    __tablename__ = "user_health_goals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    userId = Column(String(36), ForeignKey("users.id"), nullable=False)
    goalId = Column(Integer, nullable=False)
