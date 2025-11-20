from sqlalchemy import Column, String, ForeignKey
import uuid
from app.core.database import Base

class FavoriteRecipe(Base):
    __tablename__ = "favorite_recipes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    userId = Column(String(36), ForeignKey("users.id"), nullable=False)
    recipeId = Column(String(36), ForeignKey("recipes.id"), nullable=False)

