from sqlalchemy.orm import Session
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


def filter_by_tags(db: Session, tags: list):
    from sqlalchemy import or_
    # tags 리스트의 모든 태그가 포함된 레시피를 찾기 위해 각 태그별로 필터링
    query = db.query(Recipe)
    for tag in tags:
        query = query.filter(Recipe.tags.contains([tag]))
    return query.all()


def filter_by_difficulty(db: Session, difficulty: str):
    return db.query(Recipe).filter(Recipe.difficulty == difficulty).all()


def filter_by_time_category(db: Session, time_category: str):
    return db.query(Recipe).filter(Recipe.timeCategory == time_category).all()

