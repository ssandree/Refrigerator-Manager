from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.recipes.recipe_schemas import (
    RecipeListResponse,
    SingleRecipeResponse,
)
from app.favorites.favorites_services import (
    get_all_favorites,
    add_favorite,
    remove_favorite,
    is_favorite,
    validate_recipe_exists,
)
from app.favorites.favorites_schemas import (
    CheckFavoriteResponse,
    DeleteFavoriteResponse,
    IsFavoriteData,
)

# 🔹 레시피 쪽에서 쓰던 변환 헬퍼 재사용
from app.recipes.recipe_router import _to_recipe_response
from app.recipes.recipe_models import Recipe

router = APIRouter(
    prefix="/favorite-recipes",
    tags=["Favorite Recipes"],
    # 모든 즐겨찾기 API는 인증 필요
    dependencies=[Depends(get_current_user)],
)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=RecipeListResponse)
def find_all(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipes = get_all_favorites(db, userId)
    return RecipeListResponse(
        total=len(recipes),  # 🔹 total 필드 추가
        data=[_to_recipe_response(recipe) for recipe in recipes],
    )


# -----------------------------
# Read - Check Favorite
# -----------------------------
@router.get("/{recipeId}/check", response_model=CheckFavoriteResponse)
def check(
    recipeId: str,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 레시피 존재 여부 확인
    validate_recipe_exists(db, recipeId)

    result = is_favorite(db, userId, recipeId)
    return CheckFavoriteResponse(
        data=IsFavoriteData(isFavorite=result)
    )


# -----------------------------
# Create (즐겨찾기 추가)
# -----------------------------
@router.post("/{recipeId}", response_model=SingleRecipeResponse)
def create(
    recipeId: str,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 즐겨찾기 추가 (이미 있으면 그냥 통과)
    add_favorite(db, userId, recipeId)

    # 방금 즐겨찾기에 넣은 레시피 조회
    recipe = db.query(Recipe).filter(Recipe.id == recipeId).first()
    if not recipe:
        # 이 상황은 거의 안 오지만, 방어 코드
        raise HTTPException(status_code=404, detail="RECIPE_NOT_FOUND")

    # 🔹 requiredfoods 정규화된 RecipeResponse 사용
    return SingleRecipeResponse(
        data=_to_recipe_response(recipe)
    )


# -----------------------------
# Delete (즐겨찾기 제거)
# -----------------------------
@router.delete("/{recipeId}", response_model=DeleteFavoriteResponse)
def delete(
    recipeId: str,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    removed = remove_favorite(db, userId, recipeId)
    if not removed:
        raise HTTPException(status_code=404, detail="NOT_FAVORITED")
    return DeleteFavoriteResponse(message="즐겨찾기에서 제거되었습니다")
