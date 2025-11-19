from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class HealthGoal(Base):
    __tablename__ = "health_goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    color = Column(String, nullable=True)

class UserHealthGoal(Base):
    __tablename__ = "user_health_goals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    userId = Column(String, ForeignKey("users.id"), nullable=False)
    goalId = Column(Integer, ForeignKey("health_goals.id"), nullable=False)

