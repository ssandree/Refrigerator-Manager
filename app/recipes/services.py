from sqlalchemy.orm import Session
from app.recipes.models import Recipe

def get_all_recipes(db: Session):
    return db.query(Recipe).all()


def get_recipe_by_id(db: Session, recipe_id: str):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()


def search_recipes(db: Session, query: str):
    return db.query(Recipe).filter(Recipe.recipeName.contains(query)).all()


def filter_by_tags(db: Session, tags: list):
    return db.query(Recipe).filter(Recipe.tags.contains(tags)).all()


def filter_by_difficulty(db: Session, difficulty: str):
    return db.query(Recipe).filter(Recipe.difficulty == difficulty).all()


def filter_by_time_category(db: Session, time_category: str):
    return db.query(Recipe).filter(Recipe.timeCategory == time_category).all()

