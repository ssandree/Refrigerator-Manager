from sqlalchemy import Column, String, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    sex = Column(String(20), nullable=True)
    bmi = Column(Float, nullable=True)

