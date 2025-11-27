from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.recipes.recipe_schemas import (
    RecipeResponse,
    SingleRecipeResponse,
    RecipeListResponse,
)
from app.recipes.recipe_services import (
    get_all_recipes,
    get_recipe_by_id,
    search_recipes,
    filter_recipes as filter_recipes_service,
)
from app.recipes.recommend_service import recommend_recipes

router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=RecipeListResponse)
def find_all(db: Session = Depends(get_db)):
    recipes = get_all_recipes(db)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Search (경로 파라미터보다 먼저 정의 필요)
# -----------------------------
@router.get("/search/", response_model=RecipeListResponse)
def search(q: str = Query(...), db: Session = Depends(get_db)):
    recipes = search_recipes(db, q)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Recommend (경로 파라미터보다 먼저 정의 필요)
# -----------------------------
@router.get("/recommend")
def recommend(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = recommend_recipes(db, userId)
    return {"success": True, "data": data}


# -----------------------------
# Filter (경로 파라미터보다 먼저 정의 필요)
# -----------------------------
@router.get("/filter", response_model=RecipeListResponse)
def filter_recipes(
    ingredients: list[str] | None = Query(
        default=None,
        description="이 재료들을 모두 포함하는 레시피만 조회"
    ),
    expiringOnly: bool = Query(
        default=False,
        description="임박 재료(3일 이내 만료) 포함 레시피만 조회"
    ),
    minCalories: int | None = Query(
        default=None,
        ge=0,
        description="최소 칼로리"
    ),
    maxCalories: int | None = Query(
        default=None,
        ge=0,
        description="최대 칼로리"
    ),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recipes = filter_recipes_service(
        db=db,
        userId=userId,
        ingredients=ingredients,
        expiring_only=expiringOnly,
        min_calories=minCalories,
        max_calories=maxCalories
    )
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Read - One (경로 파라미터는 마지막에 정의)
# -----------------------------
@router.get("/{recipe_id}", response_model=SingleRecipeResponse)
def find_one(recipe_id: str, db: Session = Depends(get_db)):
    recipe = get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="RECIPE_NOT_FOUND")
    return SingleRecipeResponse(data=RecipeResponse.model_validate(recipe))
