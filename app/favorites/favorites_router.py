from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.recipes.recipe_schemas import (
    RecipeResponse,
    RecipeListResponse,
    SingleRecipeResponse
)
from app.favorites.favorites_services import (
    get_all_favorites,
    add_favorite,
    remove_favorite,
    is_favorite,
    filter_favorites_by_tags,
    validate_recipe_exists
)
from app.favorites.favorites_schemas import (
    CheckFavoriteResponse,
    DeleteFavoriteResponse,
    IsFavoriteData
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
@router.get("/{recipeId}/check", response_model=CheckFavoriteResponse)
def check(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    # 레시피 존재 여부 확인
    validate_recipe_exists(db, recipeId)
    
    result = is_favorite(db, userId, recipeId)
    return CheckFavoriteResponse(data=IsFavoriteData(isFavorite=result))


# -----------------------------
# Create
# -----------------------------
@router.post("/{recipeId}", response_model=SingleRecipeResponse)
def create(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    from app.recipes.recipe_models import Recipe
    add_favorite(db, userId, recipeId)
    recipe = db.query(Recipe).filter(Recipe.id == recipeId).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="RECIPE_NOT_FOUND")
    return SingleRecipeResponse(data=RecipeResponse.model_validate(recipe))


# -----------------------------
# Delete
# -----------------------------
@router.delete("/{recipeId}", response_model=DeleteFavoriteResponse)
def delete(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    removed = remove_favorite(db, userId, recipeId)
    if not removed:
        raise HTTPException(status_code=404, detail="NOT_FAVORITED")
    return DeleteFavoriteResponse(message="즐겨찾기에서 제거되었습니다")


# -----------------------------
# Filter by Tags
# -----------------------------
@router.get("/filter-by-tags", response_model=RecipeListResponse)
def filter_by_tags(
    tags: list[str] = Query(..., description="tags"),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recipes = filter_favorites_by_tags(db, userId, tags)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )
