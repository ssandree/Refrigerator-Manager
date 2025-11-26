from datetime import datetime, timedelta
from typing import Iterable, Optional

from sqlalchemy.orm import Session

from app.food.food_models import Food
from app.recipes.recipe_models import Recipe

def get_all_recipes(db: Session):
    return db.query(Recipe).all()


def get_recipe_by_id(db: Session, recipe_id: str):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()


def search_recipes(db: Session, query: str):
    from sqlalchemy import or_
    return db.query(Recipe).filter(
        or_(
            Recipe.recipeName.contains(query),
            Recipe.requiredfoods.contains([query])
        )
    ).all()


def filter_recipes(
    db: Session,
    userId: str,
    ingredients: Optional[Iterable[str]] = None,
    expiring_only: bool = False,
    min_calories: Optional[int] = None,
    max_calories: Optional[int] = None,
):
    query = db.query(Recipe)

    if min_calories is not None:
        query = query.filter(Recipe.calories >= min_calories)
    if max_calories is not None:
        query = query.filter(Recipe.calories <= max_calories)

    recipes = query.all()

    if ingredients:
        normalized = {item.strip() for item in ingredients if item and item.strip()}
        if normalized:
            recipes = [
                recipe for recipe in recipes
                if normalized.issubset(set(recipe.requiredfoods or []))
            ]

    if expiring_only:
        today = datetime.utcnow().date()
        threshold = today + timedelta(days=3)
        expiring_foods = db.query(Food).filter(
            Food.userId == userId,
            Food.expiryDate.isnot(None),
            Food.expiryDate >= today,
            Food.expiryDate <= threshold
        ).all()
        expiring_names = {food.name for food in expiring_foods}

        if not expiring_names:
            recipes = []
        else:
            recipes = [
                recipe for recipe in recipes
                if expiring_names.intersection(set(recipe.requiredfoods or []))
            ]

    return recipes

