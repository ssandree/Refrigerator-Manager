from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.recipes.recipe_schemas import (
    RecipeResponse,
    RecipeListResponse
)
from app.favorites.favorites_services import (
    get_all_favorites,
    add_favorite,
    remove_favorite,
    is_favorite,
    filter_favorites_by_tags
)

router = APIRouter(
    prefix="/favorite-recipes",
    tags=["Favorite Recipes"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=RecipeListResponse)
def find_all(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    recipes = get_all_favorites(db, userId)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Read - Check Favorite
# -----------------------------
@router.get("/{recipeId}/check")
def check(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    result = is_favorite(db, userId, recipeId)
    return {"success": True, "data": {"isFavorite": result}}


# -----------------------------
# Create
# -----------------------------
@router.post("/{recipeId}")
def create(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    add_favorite(db, userId, recipeId)
    return {"success": True, "data": {"recipeId": recipeId, "isFavorite": True}}


# -----------------------------
# Delete
# -----------------------------
@router.delete("/{recipeId}")
def delete(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    removed = remove_favorite(db, userId, recipeId)
    if not removed:
        raise HTTPException(status_code=404, detail="NOT_FAVORITED")
    return {"success": True, "message": "즐겨찾기에서 제거되었습니다"}


# -----------------------------
# Filter by Tags
# -----------------------------
@router.post("/filter-by-tags", response_model=RecipeListResponse)
def filter_by_tags(body: dict, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    tags = body.get("tags", [])
    recipes = filter_favorites_by_tags(db, userId, tags)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )
