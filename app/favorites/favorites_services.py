from sqlalchemy.orm import Session
from app.favorites.favorites_models import FavoriteRecipe
from app.recipes.recipe_models import Recipe

def get_all_favorites(db: Session, userId: str):
    return db.query(Recipe).join(
        FavoriteRecipe, Recipe.id == FavoriteRecipe.recipeId
    ).filter(
        FavoriteRecipe.userId == userId
    ).all()


def add_favorite(db: Session, userId: str, recipeId: str):
    exists = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.userId == userId,
        FavoriteRecipe.recipeId == recipeId
    ).first()

    if exists:
        return exists  # 이미 즐겨찾기면 그냥 반환

    fav = FavoriteRecipe(userId=userId, recipeId=recipeId)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


def remove_favorite(db: Session, userId: str, recipeId: str):
    fav = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.userId == userId,
        FavoriteRecipe.recipeId == recipeId
    ).first()

    if not fav:
        return False

    db.delete(fav)
    db.commit()
    return True


def is_favorite(db: Session, userId: str, recipeId: str):
    fav = db.query(FavoriteRecipe).filter(
        FavoriteRecipe.userId == userId,
        FavoriteRecipe.recipeId == recipeId
    ).first()

    return fav is not None


def filter_favorites_by_tags(db: Session, userId: str, tags: list):
    return db.query(Recipe).join(
        FavoriteRecipe, Recipe.id == FavoriteRecipe.recipeId
    ).filter(
        FavoriteRecipe.userId == userId,
        Recipe.tags.contains(tags)
    ).all()

