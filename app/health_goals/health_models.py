from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

# HealthGoal 모델 제거 - health_constants.py의 상수만 사용
# class HealthGoal(Base):
#     __tablename__ = "health_goals"
#     ...

class UserHealthGoal(Base):
    __tablename__ = "user_health_goals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    userId = Column(String(36), ForeignKey("users.id"), nullable=False)
    goalId = Column(Integer, nullable=False)  # ForeignKey 제거 - health_constants.py의 상수만 사용

